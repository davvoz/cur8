import { Client, VestingDelegation } from "@hiveio/dhive";
import { Utils } from "../classes/my_utils";

/**
 * Interfaccia per le proprietà dinamiche globali.
 */
interface DynamicGlobalProperties {
    totalVestingFundHive: number;
    totalVestingShares: number;
}

/**
 * Interfaccia per l'ultimo pagamento.
 */
interface UltimoPagamento {
    data: Date;
    importo: number;
}

/**
 * Interfaccia per il rapporto con CUR8.
 */
interface RapportoConCUR8 {
    delega: number;
    estimatedDailyProfit: number;
    powerDisponibili: number;
    share: number;
    ultimoPagamento: UltimoPagamento;
}

/**
 * Interfaccia per i dati sociali.
 */
interface Social {
    followers: number;
    following: number;
    postsNumber: number;
    level: number;
}

/**
 * Interfaccia per i saldi delle valute.
 */
interface Valutes {
    HIVE: number;
    HBD: number;
    HP: number;
    STEEM: number;
    SBD: number;
    SP: number;
}

/**
 * Tipo per la piattaforma.
 */
type Platform = 'HIVE' | 'STEEM';

/**
 * Tipo per la funzione di fetch.
 */
type FetchFunction = (client: Client, ...args: any[]) => Promise<any>;

/**
 * Classe per la gestione degli utenti.
 */
class UserManager {
    private client: Client;
    private dynamicGlobalProperties: DynamicGlobalProperties | null = null;

    /**
     * Costruttore della classe UserManager.
     * @param platform La piattaforma (HIVE o STEEM).
     * @param apiUrls Mappa degli URL API per la piattaforma.
     */
    constructor(private platform: Platform, private apiUrls: Map<Platform, string[]>) {
        const urls = apiUrls.get(platform);
        if (!urls) {
            throw new Error(`API URLs not found for platform ${platform}`);
        }

        this.client = new Client(urls[0]); // Utilizzo del primo URL per semplicità
    }

    /**
     * Metodo per recuperare le proprietà dinamiche globali.
     */
    private async fetchDynamicGlobalProperties(): Promise<void> {
        const properties = await this.client.database.getDynamicGlobalProperties();
        this.dynamicGlobalProperties = {
            totalVestingFundHive: parseFloat(properties.total_vesting_fund_hive.toString()),
            totalVestingShares: parseFloat(properties.total_vesting_shares.toString())
        };
    }

    /**
     * Metodo per recuperare l'account dell'utente.
     * @param username Il nome utente.
     * @returns Il risultato della richiesta dell'account.
     */
    private async fetchAccount(username: string): Promise<any> {
        return (await this.client.database.getAccounts([username]))[0];
    }

    /**
     * Metodo per recuperare le deleghe di vesting.
     * @param username Il nome utente.
     * @returns Il risultato della richiesta delle deleghe.
     */
    private async fetchVestingDelegations(username: string): Promise<VestingDelegation[]> {
        return await this.client.database.getVestingDelegations(username, 'cur8', 1000);
    }

    /**
     * Metodo per recuperare la cronologia dell'account.
     * @param username Il nome utente.
     * @returns Il risultato della richiesta della cronologia dell'account.
     */
    private async fetchAccountHistory(username: string): Promise<any[]> {
        return await this.client.database.getAccountHistory(username, -1, 1000, [4, 0]);
    }
    /**
     * Metodo per recuperare le transazioni dell'account.
     * @param username Il nome utente.
     * @returns Array di MYTransaction.
     */
    private async fetchAccountTransactions(username: string): Promise<MYTransaction[]> {
        let listaDiTransazioni = await this.client.database.getAccountHistory(username, -1, 1000, [4, 0]);
        listaDiTransazioni.reverse();
        let transactions: MYTransaction[] = [];
        for (let i = 0; i < listaDiTransazioni.length; i++) {
            const transazione = listaDiTransazioni[i];
            const op = transazione[1].op;
            if (op[0] === 'transfer') {
                const data = new Date(transazione[1].timestamp);
                const timestamp = Utils.formatDate(data);
                const amount = op[1]['amount'];
                const from = op[1]['from'];
                const to = op[1]['to'];
                const memo = op[1]['memo'];
                const id = transazione[0];
                transactions.push({ timestamp, amount, from, to, memo, id });
            }
        }
        return transactions;
    }

    /**
     * Metodo per calcolare la share.
     * @param delega La delega.
     * @param account L'account.
     * @returns Il valore della share calcolato.
     */
    private async calculateShare(delega: number, account: any): Promise<number> {
        const { vesting_shares, received_vesting_shares } = account;
        if (!vesting_shares || !received_vesting_shares || !this.dynamicGlobalProperties) {
            console.error("Invalid account data or dynamic global properties");
            return 0;
        }

        const { totalVestingShares, totalVestingFundHive } = this.dynamicGlobalProperties;
        const share = parseFloat(vesting_shares) + parseFloat(received_vesting_shares);
        const hp = Utils.vestingShares2HP(share, totalVestingFundHive, totalVestingShares);
        return this.calculateShareValue(delega, hp);
    }

    /**
     * Metodo per calcolare la differenza di potenza disponibile.
     * @param delegations Le deleghe di vesting.
     * @param username Il nome utente.
     * @returns La differenza di potenza disponibile calcolata.
     */
    private async calculatePowerDifference(delegations: VestingDelegation[], username: string): Promise<number> {
        let sommatoria = 0;
        for (const delegation of delegations) {
            sommatoria += parseFloat(delegation.vesting_shares.toString());
        }

        if (!this.dynamicGlobalProperties) {
            console.error("Dynamic global properties not available");
            return 0;
        }

        const { totalVestingShares, totalVestingFundHive } = this.dynamicGlobalProperties;
        const hp = Utils.vestingShares2HP(sommatoria, totalVestingFundHive, totalVestingShares);
        const account = await this.fetchAccount(username);
        const hivePower = parseFloat(account.vesting_shares);
        console.log(account);
        return hivePower - hp;
    }

    /**
     * Metodo per calcolare il valore della share.
     * @param delega La delega.
     * @param share La share.
     * @returns Il valore della share calcolato.
     */
    private calculateShareValue(delega: number, share: number): number {
        return Math.round(delega * 100 / share * 100) / 100;
    }

    /**
     * Metodo per impostare l'ultimo pagamento.
     * @param username Il nome utente.
     * @returns L'ultimo pagamento.
     */
    private async setUltimoPagamento(username: string): Promise<UltimoPagamento | null> {

        const listaDiTransazioni = await this.fetchAccountHistory(username);
        const transferTransaction = listaDiTransazioni.reverse().find(transazione => {
            const op = transazione[1].op;
            return op[0] === 'transfer' && op[1]['from'] === 'cur8';
        });

        if (transferTransaction) {
            const { op, timestamp } = transferTransaction[1];
            const data = new Date(timestamp);
            const importo = op[1]['amount'];
            return { data, importo };
        }

        return null;
    }

    /**
     * Metodo per impostare la delega.
     * @param delegations Le deleghe di vesting.
     * @returns La delega calcolata.
     */
    private async setDelega(delegations: VestingDelegation[]): Promise<number> {
        if (delegations.length > 0) {
            const vs: VestingDelegation = delegations[0];
            const { vesting_shares } = vs;
            if (!vesting_shares || !this.dynamicGlobalProperties) {
                console.error("Invalid delegation or dynamic global properties");
                return 0;
            }

            const { totalVestingFundHive, totalVestingShares } = this.dynamicGlobalProperties;
            const vestingShares = parseFloat(vesting_shares.toString());
            return totalVestingFundHive * vestingShares / totalVestingShares;
        }
        return 0;
    }

    public async setTransactions(username: string): Promise<MYTransaction[]> {
        return await this.fetchAccountTransactions(username);

    }

    /**
     * Metodo per creare un utente.
     * @param username Il nome utente.
     * @returns I dati dell'utente creato.
     */
    public async creaUser(username: string): Promise<User> {
        if (!this.dynamicGlobalProperties) {
            await this.fetchDynamicGlobalProperties();
        }
        if (!username) {
            return this.setDefaultUser();
        }

        const [valutes, social] = await Promise.all([
            this.getValutes(username),
            this.getSocial(username)
        ]);

        let delega = 0;
        let share = 0;
        let powerDisponibili = 0;
        let ultimoPagamento: UltimoPagamento | null = null;
        let global_properties = this.dynamicGlobalProperties;
        let transactions = await this.setTransactions(username);
        let account = await this.fetchAccount(username);
        //posting_json_metadata:"{\"profile\":{\"profile_image\":\"https://files.peakd.com/file/peakd-hive/jacopo.eth/OTD8nr7N-jkjjiuj.jpg\",\"cover_image\":\"https://images.hive.blog/DQmNS5rcacMvFDUrgCaC34nHRZ8diSqK2mcAz8k3V2D5wQM/mmm.jpeg\",\"name\":\"jacopo.eth\",\"location\":\"italy\",\"version\":2,\"tokens\":[]}}"
        let image = JSON.parse(account.posting_json_metadata).profile.profile_image;
        
        if (this.platform === 'HIVE') {
            const delegations = await this.fetchVestingDelegations(username);
            delega = await this.setDelega(delegations);
            share = await this.calculateShare(delega, await this.fetchAccount('cur8'));
            powerDisponibili = await this.calculatePowerDifference(delegations, username);
            ultimoPagamento = await this.setUltimoPagamento(username);
        } else {
            ultimoPagamento = await this.setUltimoPagamento(username);
        }

        const rapportoConCUR8: RapportoConCUR8 = {
            delega,
            estimatedDailyProfit: 0,
            powerDisponibili,
            share,
            ultimoPagamento: ultimoPagamento || { data: new Date(), importo: 0 }
        };

        return {
            image,
            global_properties: global_properties!,
            account_value: 0,
            username,
            platform: this.platform,
            valutes,
            social,
            rapportoConCUR8,
            transactions
        };
    }

    private setDefaultUser(): User | PromiseLike<User> {
        return {
            image: '',
            global_properties: this.dynamicGlobalProperties!,
            account_value: 0,
            username: '',
            platform: this.platform,
            valutes: {
                HIVE: 0,
                HBD: 0,
                HP: 0,
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
                ultimoPagamento: { data: new Date(), importo: 0 }
            },
            transactions: []
        };
    }

    /**
     * Metodo per recuperare i dati sociali dell'utente.
     * @param username Il nome utente.
     * @returns I dati sociali dell'utente.
     */
    private async getSocial(username: string): Promise<Social> {
        const account = await this.fetchAccount(username);
        return {
            followers: account.followers_count,
            following: account.following_count,
            postsNumber: account.post_count,
            level: 0
        };
    }

    /**
     * Metodo per recuperare i saldi delle valute dell'utente.
     * @param username Il nome utente.
     * @returns I saldi delle valute dell'utente.
     */
    private async getValutes(username: string): Promise<Valutes> {
        const account = await this.fetchAccount(username);
        const balances: Valutes = {
            HIVE: 0,
            HBD: 0,
            HP: 0,
            STEEM: 0,
            SBD: 0,
            SP: 0
        };

        if (this.platform === 'HIVE') {
            balances.HIVE = parseFloat(account.balance);
            balances.HBD = parseFloat(account.hbd_balance);
            balances.HP = Utils.vestingShares2HP(
                parseFloat(account.vesting_shares),
                this.dynamicGlobalProperties!.totalVestingFundHive,
                this.dynamicGlobalProperties!.totalVestingShares);
        } else {
            balances.STEEM = parseFloat(account.balance);
            balances.SP = parseFloat(account.vesting_shares);
        }

        return balances;
    }
}

// Mappe degli URL API per HIVE e STEEM
const apiUrls = new Map<Platform, string[]>([
    ['HIVE', ["https://api.hive.blog", "https://api.hivekings.com", "https://anyx.io", "https://api.openhive.network"]],
    ['STEEM', ["https://api.steemit.com", "https://rpc.ecency.com", "https://api.hive.blog", "https://anyx.io"]]
]);

/**
 * Classe per la creazione degli utenti.
 */
export class UserFactory {
    private userManagers: Map<Platform, UserManager>;

    /**
     * Costruttore della classe UserFactory.
     */
    constructor() {
        this.userManagers = new Map();
        ['HIVE', 'STEEM'].forEach(platform => {
            this.userManagers.set(platform as Platform, new UserManager(platform as Platform, apiUrls));
        });
    }

    /**
     * Metodo per creare un utente.
     * @param username Il nome utente.
     * @param platform La piattaforma (HIVE o STEEM).
     * @returns I dati dell'utente creato.
     */
    public async creaUser(username: string, platform: Platform): Promise<User> {
        const userManager = this.userManagers.get(platform);
        if (!userManager) {
            throw new Error(`User manager not found for platform ${platform}`);
        }

        return userManager.creaUser(username);
    }
}
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
}