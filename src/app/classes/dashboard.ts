import { VoteTransaction } from "./biz/hive-user";

abstract class Dashboard {
    total_power: number = 0;
    total_delegators: number = 0;
    all_time_payout: number = 0;
    voting_power: number = 0;
    last_7_days_payout: number = 0;
    last_7_days_curation_rewards: any = 0;
    vote_transactions: VoteTransaction[] = [];
    news: any[] = [];
}

class ApiPlatformMapper {
    metodo: Function;
    parametri: any[];
    constructor( metodo: Function, parametri: any[] = []) {
        this.metodo = metodo;
        this.parametri = parametri;
    }

    async esegui() {
        return this.metodo(...this.parametri);
    }

}

class ApiPlatform {
    static async esegui(mapper: ApiPlatformMapper) {
        return await mapper.esegui();
    }
}//usage : ApiPlatform.esegui(new ApiPlatformMapper(GlobalPropertiesHiveService.setPrices, []));


