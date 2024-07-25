declare var window: any;

interface Keychain {
    requestHandshake(): Promise<void>;
    requestSignBuffer(username: string, message: string, type: string, callback: Function): Promise<{ success: boolean }>;
}

interface LoginStrategy {
    login(username: string, callback: Function): Promise<{ success: boolean }>;
}

class BaseLoginStrategy implements LoginStrategy {    

    constructor(private keychainName: string) { }

    async login(username: string, callback: Function): Promise<{ success: boolean }> {

        const keychain = this.getKeychain();
        if (!keychain) {
            throw new Error('Keychain not found');
        }

        //await keychain.requestHandshake();

        keychain.requestSignBuffer(username, 'Login with Keychain', 'Active', function (response: { success: any; }) {
            if (response.success) {
                console.log('Login success' + response);
                callback?.apply(null, [response]);
            } else {
                console.log('Login failed' + response);
                throw new Error('Login failed');
            }

        });
        return { success: true };
    }

    private getKeychain(): Keychain | undefined {
        return window[this.keychainName] as Keychain;
    }
}


class HiveLoginStrategy extends BaseLoginStrategy {
    constructor() {
        super('hive_keychain');
    }
}

class SteemLoginStrategy extends BaseLoginStrategy {
    constructor() {
        super('steem_keychain');
    }
}

class Login {
    private strategy: LoginStrategy;

    constructor(strategy: LoginStrategy) {
        this.strategy = strategy;
    }

    async login(username: string, callback: Function): Promise<{ success: boolean }> {
        return this.strategy.login(username, callback);
    }
}

export class StaticLogin {
    static async loginWithHiveKeychain(username: string, callback: Function): Promise<{ success: boolean }> {
        const login = new Login(new HiveLoginStrategy());
        return login.login(username, callback);
    }

    static async loginWithSteemKeychain(username: string, callback: Function): Promise<{ success: boolean }> {
        const login = new Login(new SteemLoginStrategy());
        return login.login(username, callback);
    }
}

//usage example  : StaticLogin.loginWithHiveKeychain('nome', (response) => { console.log(response) });