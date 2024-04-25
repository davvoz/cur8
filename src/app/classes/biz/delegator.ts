declare var window: any;

interface Keychain {
    requestHandshake(): Promise<void>;
    requestDelegation(username: string, delegatee: string, amount: string, type: string, callback: Function): Promise<{ success: boolean }>;
}

interface Delegatrategy {
    login(username: string, delegatee: string, amount: string, callback: Function): Promise<{ success: boolean }>;
}

class BaseDelegateStrategy implements Delegatrategy {
    constructor(private keychainName: string) { }

    async login(username: string, delegatee: string, amount: string, callback: Function): Promise<{ success: boolean }> {
        amount = parseFloat(amount.toString()).toFixed(3)
        const keychain = this.getKeychain();
        if (!keychain) {
            throw new Error('Keychain not found');
        }

        await keychain.requestHandshake();
        const type = this.keychainName === 'hive_keychain' ? 'HP' : 'SP';
        keychain.requestDelegation(username, delegatee, amount, type, function (response: { success: any; }) {
            if (response.success) {
                console.log('Delegation success' + response);
                callback?.apply(null, [response]);
            } else {
                console.log('Delegation failed' + response);
                throw new Error('Delegation failed');
            }

        });
        return { success: true };
    }

    private getKeychain(): Keychain | undefined {
        return window[this.keychainName] as Keychain;
    }
}


class HiveDelegateStrategy extends BaseDelegateStrategy {
    constructor() {
        super('hive_keychain');
    }
}


class SteemDelegateStrategy extends BaseDelegateStrategy {
    constructor() {
        super('steem_keychain');
    }
}

class Delegator {
    private strategy: Delegatrategy;

    constructor(strategy: Delegatrategy) {
        this.strategy = strategy;
    }
    async delegate(username: string, delegatee: string, amount: string, callback: Function): Promise<{ success: boolean }> {
        return this.strategy.login(username, delegatee, amount, callback);
    }
}

export class StaticDelegator {
    static async delegateWithHive(username: string, delegatee: string, amount: string, callback: Function): Promise<{ success: boolean }> {
        const delegator = new Delegator(new HiveDelegateStrategy());
        return delegator.delegate(username, delegatee, amount, callback);
    }

    static async delegateWithSteem(username: string, delegatee: string, amount: string, callback: Function): Promise<{ success: boolean }> {
        const delegator = new Delegator(new SteemDelegateStrategy());
        return delegator.delegate(username, delegatee, amount, callback);
    }
}
