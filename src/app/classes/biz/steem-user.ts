
import { Client, VestingDelegation } from "dsteem";
import { Utils } from "../my_utils";
import { ApiService } from "../../services/api.service";

interface DynamicGlobalProperties {
    totalVestingFundSteem: number;
    totalVestingShares: number;
}

interface UltimoPagamento {
    data: Date;
    importo: number;
}

interface RapportoConCUR8 {
    delega: number;
    estimatedDailyProfit: number;
    powerDisponibili: number;
    share: number;
    ultimoPagamento: UltimoPagamento;
}

interface Social {
    followers: number;
    following: number;
    postsNumber: number;
    level: number;
}

interface Valutes {
    STEEM: number;
    SBD: number;
    SP: number;
}

type Platform = 'STEEM';

export interface MYTransaction {
    timestamp: string;
    amount: string;
    from: string;
    to: string;
    memo: string;
    id: number;
}

export interface User {
    image: string;
    username: string;
    platform: Platform;
    valutes: Valutes;
    social: Social;
    rapportoConCUR8: RapportoConCUR8;
    account_value: number;
    global_properties: DynamicGlobalProperties;
    transactions: MYTransaction[];
    expiringDelegations: ExpiringDelegation[];
    totalExpiringDelegations: number;


}

export interface ExpiringDelegation {
    vesting_shares: number;
    expiration: Date;
}


class UserManager {
    client = new Client('https://api.moecki.online');
    private dynamicGlobalProperties!: DynamicGlobalProperties;
    private account!: any;
    private valutes: Valutes = {
        STEEM: 0,
        SBD: 0,
        SP: 0
    };
    private social: Social = {
        followers: 0,
        following: 0,
        postsNumber: 0,
        level: 0
    };
    private transactions: MYTransaction[] = [];
    private expringDelegations: ExpiringDelegation[] = [];
    private user: User = this.getDefaultUser();
    private delegations: VestingDelegation[] = [];
    constructor() { }

    async init(username: string, global: DynamicGlobalProperties): Promise<string> {
        let tempoImpiegato = 0;
        let tempoInizio = new Date().getTime();
        let tempoFine = 0;
        this.dynamicGlobalProperties = global;
        this.user.global_properties = this.dynamicGlobalProperties;
        // await this.fetchDynamicGlobalProperties().then(() => {
        //     this.user.global_properties = this.dynamicGlobalProperties;
        // });
        await this.fetchAccount(username).then(() => {
            this.user.username = this.account.name;
        });
        await this.setValutes().then(() => {
            this.user.valutes = this.valutes;
        });
        this.setSocial();
        await this.setTransactions().then(() => {
            this.user.transactions = this.transactions;
        });
        await this.setExpringDelegations().then(() => {
            this.user.expiringDelegations = this.expringDelegations;

        });
        await this.setDelegations();
        await this.creaUser().then((user) => {
            this.user = user;
            tempoFine = new Date().getTime();
            tempoImpiegato = tempoFine - tempoInizio;
            return 'ok , tempo impiegato: ' + tempoImpiegato;
        });
        tempoFine = new Date().getTime();
        tempoImpiegato = tempoFine - tempoInizio;
        return 'ok , tempo impiegato: ' + tempoImpiegato;
    }

    private async setDelegations(): Promise<void> {
        await this.fetchVestingDelegations(this.account.name).then((res) => {
            this.delegations = res;
        });
    }

    private async setExpringDelegations(): Promise<void> {
        return this.client.database.call('get_expiring_vesting_delegations', [this.account.name, '2018-01-01T00:00:00']).then((res) => {
            for (let i = 0; i < res.length; i++) {
                const number = Utils.toStringParseFloat(res[i]['vesting_shares']);
                const vesting_shares = Utils.vestingShares2HP(number,
                    this.dynamicGlobalProperties.totalVestingFundSteem,
                    this.dynamicGlobalProperties.totalVestingShares);
                    const expiration = Utils.convertToUserTimeZone(new Date(res[i]['expiration']));
                    this.expringDelegations.push({ vesting_shares, expiration });
            }
        });
    }

    private async fetchAccount(username: string): Promise<void> {
        const account = await this.client.database.getAccounts([username]);
        this.account = account[0];
        this.client.database.getDynamicGlobalProperties().then((res) => {
            this.dynamicGlobalProperties = {
                totalVestingFundSteem: Utils.toStringParseFloat(res.total_vesting_fund_steem),
                totalVestingShares: Utils.toStringParseFloat(res.total_vesting_shares)
            };
        });
    }

    private async fetchVestingDelegations(username: string): Promise<VestingDelegation[]> {
        return await this.client.database.getVestingDelegations(username, 'cur8', 1000);
    }
    private async fetchVestingDelegationsNoFilter(username: string): Promise<VestingDelegation[]> {
        return await this.client.database.getVestingDelegations(username, undefined, 1000);
    }

    private async fetchAccountTransactions(username: string): Promise<void> {
        //getAccountHistory(username, -1, 1000, [4, 0]);
        let listaDiTransazioni = await this.client.database.call('get_account_history', [username, -1, 1000]);
        listaDiTransazioni.reverse();
        let transactions: MYTransaction[] = [];
        for (let i = 0; i < listaDiTransazioni.length; i++) {
            const transazione = listaDiTransazioni[i];
            const op = transazione[1].op;
            if (op[0] === 'transfer') {
                const data = new Date(transazione[1].timestamp);
                const timestampT = Utils.convertToUserTimeZone(data);
                const amount = op[1]['amount'];
                const from = op[1]['from'];
                const to = op[1]['to'];
                const memo = op[1]['memo'];
                const id = transazione[0];
                const timestamp = timestampT.toString();
                transactions.push({ timestamp, amount, from, to, memo, id });
            }
        }
        this.transactions = transactions;
    }

    private async calculateShare() {
        const res = await this.client.database.getAccounts(['cur8']);
        const totCur8 = Utils.toStringParseFloat(res[0].vesting_shares);
        const recivedVestingShares = Utils.toStringParseFloat(res[0].received_vesting_shares);
        const sommatoria = Utils.vestingShares2HP(totCur8 + recivedVestingShares, this.dynamicGlobalProperties.totalVestingFundSteem, this.dynamicGlobalProperties.totalVestingShares);
        return this.calculateShareValue(sommatoria);
    }

    private async calculatePowerDifference(): Promise<number> {
        //tiriamo su tutte le deleghe
        const delegations = await this.fetchVestingDelegationsNoFilter(this.account.name);
        let sommatoria = 0;
        for (const delegation of delegations) {
            sommatoria += Utils.toStringParseFloat(delegation.vesting_shares);
        }

        const hiveUser = this.user.valutes.SP;
        const { totalVestingShares, totalVestingFundSteem } = this.dynamicGlobalProperties;
        const diff = hiveUser - Utils.vestingShares2HP(sommatoria, totalVestingFundSteem, totalVestingShares);
        let sum = 0;

        this.expringDelegations.forEach((delegation) => {
            sum += delegation.vesting_shares;
        });

        const out = diff - Utils.vestingShares2HP(sum, totalVestingFundSteem, totalVestingShares);
        return out;
    }

    private calculateShareValue(totCur8: number): number {
        if (this.delegations.length === 0) {
            return 0;
        }
        for (let i = 0; i < this.delegations.length; i++) {
            if (this.delegations[i].delegatee === 'cur8') {
                const converted = Utils.toStringParseFloat(this.delegations[0].vesting_shares);
                const out = Utils.vestingShares2HP(converted, this.dynamicGlobalProperties.totalVestingFundSteem, this.dynamicGlobalProperties.totalVestingShares) * 100 / totCur8;
                this.user.rapportoConCUR8.share = out;
                return out;
            }
        }
        return 0;
    }

    private async setUltimoPagamento(username: string): Promise<UltimoPagamento | null> {

        const listaDiTransazioni = await this.client.database.call('get_account_history', [username, -1, 1000]);
        const transferTransaction = listaDiTransazioni.reverse().find((transazione: { op: any; }[]) => {
            const op = transazione[1].op;
            return op[0] === 'transfer' && op[1]['from'] === 'cur8';
        });

        if (transferTransaction) {
            const { op, timestamp } = transferTransaction[1]; 
            const dat = new Date(timestamp);
            const dataInUserTimezone = Utils.convertToUserTimeZone(dat);
            const data = new Date(dataInUserTimezone);
            const importo = op[1]['amount'];
            return { data, importo };
        }

        return null;
    }

    private async setDelega(delegations: VestingDelegation[]): Promise<number> {
        if (delegations.length > 0) {
            const vs = delegations.find((delegation) => delegation.delegatee === 'cur8') as VestingDelegation;
            const { vesting_shares } = vs === undefined || vs === null ? { vesting_shares: 0 } : vs;
            if (!vesting_shares || !this.dynamicGlobalProperties) {
                console.error("Invalid delegation or dynamic global properties");
                return 0;
            }

            const { totalVestingFundSteem, totalVestingShares } = this.dynamicGlobalProperties;
            const vestingShares = Utils.toStringParseFloat(vesting_shares);
            return Utils.vestingShares2HP(vestingShares, totalVestingFundSteem, totalVestingShares);
        }
        return 0;
    }

    public async setTransactions(): Promise<void> {
        await this.fetchAccountTransactions(this.account.name);
    }

    private async creaUser(): Promise<User> {
        let delega = 0;
        let powerDisponibili = 0;
        let ultimoPagamento: UltimoPagamento | null = null;
        let global_properties = this.dynamicGlobalProperties;
        let image
        if (this.account.posting_json_metadata) {
            image = JSON.parse(this.account.posting_json_metadata).profile.profile_image;
            if (!this.account.posting_json_metadata) {
                image = '/assets/default_user.jpg';
            }
            if (JSON.parse(this.account.posting_json_metadata).profile.profile_image === undefined ||
                JSON.parse(this.account.posting_json_metadata).profile.profile_image === '' ||
                JSON.parse(this.account.posting_json_metadata).profile.profile_image === null) {
                image = '/assets/default_user.jpg';
            }
        } else {
            image = '/assets/default_user.jpg';
        }
        //const delegations = await this.fetchVestingDelegations(this.account.name);
        let shareValue = 0;
        await this.setDelega(this.delegations).then((res) => {
            delega = res;

        });
        await this.calculateShare().then((res) => {
            shareValue = res;
        });
        powerDisponibili = await this.calculatePowerDifference();
        ultimoPagamento = await this.setUltimoPagamento(this.account.name);

        const rapportoConCUR8: RapportoConCUR8 = {
            delega,
            estimatedDailyProfit: 0,
            powerDisponibili: powerDisponibili,
            share: shareValue,
            ultimoPagamento: ultimoPagamento || { data: new Date(), importo: 0 }
        };

        return {
            image: image,
            global_properties: global_properties!,
            account_value: 0,
            username: this.account.name,
            platform: 'STEEM',
            valutes: this.valutes,
            social: this.social,
            rapportoConCUR8,
            transactions: this.transactions,
            expiringDelegations: this.expringDelegations,
            totalExpiringDelegations: this.expringDelegations.reduce((acc, val) => acc + val.vesting_shares, 0)

        };
    }

    private async setSocial(): Promise<void> {
        //come si injecta il servizio apiService? 
        const apiService = new ApiService();
        const url = 'https://imridd.eu.pythonanywhere.com/api/steem/follow/' + this.account.name;
        const res = await apiService.get(url);
        this.social = {
            followers: res.follower_count,
            following: res.following_count,
            postsNumber: this.account.post_count,
            level: Math.round(res.rep)
        };
    }

    private async setValutes(): Promise<void> {
        const balances: Valutes = {
            STEEM: 0,
            SBD: 0,
            SP: 0
        };

        balances.STEEM = Utils.toStringParseFloat(this.account.balance);

        balances.SBD = Utils.toStringParseFloat(this.account.sbd_balance);
        balances.SP = Utils.vestingShares2HP(
            Utils.toStringParseFloat(this.account.vesting_shares),
            this.dynamicGlobalProperties!.totalVestingFundSteem,
            this.dynamicGlobalProperties!.totalVestingShares);

        this.valutes = balances;
    }

    public getUser(): User {
        return this.user;
    }

    getDefaultUser(): User {
        return {
            totalExpiringDelegations: 0,
            expiringDelegations: [],
            image: '',
            username: '',
            platform: 'STEEM',
            valutes: {
                STEEM: 0,
                SBD: 0,
                SP: 0
            },
            social: {
                followers: 0,
                following: 0,
                postsNumber: 0,
                level: 0
            },
            rapportoConCUR8: {
                delega: 0,
                estimatedDailyProfit: 0,
                powerDisponibili: 0,
                share: 0,
                ultimoPagamento: {
                    data: new Date(),
                    importo: 0
                }
            },
            account_value: 0,
            global_properties: {
                totalVestingFundSteem: 0,
                totalVestingShares: 0,
            },
            transactions: []
        };
    }
}

export class UserFactory {
    public static async getUser(username: string, global: DynamicGlobalProperties): Promise<User> {
        const userManager = new UserManager();
        return await userManager.init(username, global).then((res) => {
            console.log(res);
            return userManager.getUser();
        });
    }
}

