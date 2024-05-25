import { Injectable } from '@angular/core';
import { GlobalPrezzi, HiveData, IMRiddData, MyPost } from '../interfaces/interfaces';
import { Client } from 'dsteem';
import { Utils } from '../classes/my_utils';
import { ApiService } from './api.service';
import { VoteTransaction } from '../classes/biz/hive-user';

@Injectable({
  providedIn: 'root'
})
export class GlobalPropertiesSteemService {
  globalProperties = {
    totalVestingFundSteem: 0,
    totalVestingShares: 0
  }

  accountCUR8: any;
  imridData: IMRiddData = {
    delegaCur8: 0,
    ultimoPagamento: 0
  }

  delegatori = 0;
  transazioniCUR8: VoteTransaction[] = [];

  globalPrezzi: GlobalPrezzi = {
    price: 0,
    price_dollar: 0
  }

  dataChart: HiveData[] = [];
  allTimePayOut_DA_MOLTIPLICARE = 0;
  daysPayout_DA_MOLTIPLICARE = 0;
  listaPost: MyPost[] = [];

  private client: Client;

  constructor(private apiService: ApiService) {
    this.client = new Client('https://api.moecki.online');

    this.initGlobalProperties();
    this.fetchAccountData('cur8');
    this.fetchVestingDelegations('jacopo.eth', 'cur8');
    this.fetchAccountHistory('jacopo.eth');
    this.fetchDelegatori();
    this.fetchHiveData();
    //this.fetchPostData('luciojolly', 9);
    //cicla 9 post di luciojolly

    this.setPrices();
    this.setTransazioniCur8();
  }

  private async initGlobalProperties(): Promise<void> {
    const result = await this.client.database.getDynamicGlobalProperties();
    this.globalProperties.totalVestingFundSteem = Utils.toStringParseFloat(result.total_vesting_fund_steem);
    this.globalProperties.totalVestingShares = Utils.toStringParseFloat(result.total_vesting_shares);
  }

  private async fetchAccountData(account: string): Promise<void> {
    const data = await this.client.database.getAccounts([account]);
    this.accountCUR8 = data[0];
  }

  private async fetchVestingDelegations(from: string, to: string): Promise<void> {
    const result = await this.client.database.getVestingDelegations(from, to, 1000);
    if (result.length > 0) {
      this.imridData.delegaCur8 = Utils.vestingShares2HP(
        Utils.toStringParseFloat(result[0].vesting_shares),
        this.globalProperties.totalVestingFundSteem,
        this.globalProperties.totalVestingShares
      );
    }
  }

  private async fetchAccountHistory(account: string): Promise<void> {
    //using call instead of getAccountHistory
    const result = await this.client.database.call('get_account_history', [account, -1, 1000]);
    result.reverse().find((transazione: { op: any; }[]) => {
      const op = transazione[1].op;
      return op[0] === 'transfer' && op[1]['from'] === 'cur8';
    });
  }

  private async fetchDelegatori(): Promise<void> {
    const result = await this.apiService.get('https://sds0.steemworld.org/delegations_api/getIncomingDelegations/cur8');
    this.delegatori = result.result.rows.length;
  }

  private async fetchHiveData(): Promise<void> {
    const data = await this.apiService.get('https://imridd.eu.pythonanywhere.com/api/steem');
    this.allTimePayOut_DA_MOLTIPLICARE = data[0]['total_rewards'];
    this.daysPayout_DA_MOLTIPLICARE = data[0]['curation_rewards_7d'];
  }

  private async fetchPostData(tag: string, limit: number): Promise<void> {
    const query = { tag, limit };
    const result = await this.client.database.getDiscussions('blog', query);
    result.forEach((post) => {
      console.log(post);
      const metadata = JSON.parse(post.json_metadata);
      this.listaPost.push({
        title: post.title,
        imageUrl: metadata.image[0],
        url: post.url
      });
    });
  }

  async fetchPostDataCiclo(autor: string): Promise<void> {

      const query = { tag: autor, limit: 1, };
      const result = await this.client.database.getDiscussions('blog', query);
      const metadata = JSON.parse(result[0].json_metadata);
      if(metadata.image){
        this.listaPost.push({
          title: result[0].title,
          imageUrl: metadata.image[0],
          url:'https://steemit.com'+ result[0].url
        });

      }
  }

  async setPrices() {
    await this.apiService.get('https://imridd.eu.pythonanywhere.com/api/prices').then((result) => {
      this.globalPrezzi.price = result['STEEM'];
      this.globalPrezzi.price_dollar = result['SBD'];
    }).finally(() => {
      console.log('Steem prices set');
    });
  }

  private async setTransazioniCur8(): Promise<void> {
    const _3DaysAgo = new Date();
    _3DaysAgo.setDate(_3DaysAgo.getDate() - 4);
    const today = new Date();
    const baseUrl = 'https://sds.steemworld.org/account_history_api/getHistoryByOpTypesTime/cur8/vote/';
    const url = baseUrl + Math.floor(_3DaysAgo.getTime() / 1000) + '-' + Math.floor(today.getTime() / 1000);
    this.apiService.get(url).then((result) => {
      const muta = result.result.rows;
      muta.forEach((transazione: any) => {
        const oggetto = transazione[6][1];
        this.transazioniCUR8.push({
          voter: oggetto.voter,
          author: oggetto.author,
          weight: oggetto.weight,
          timestamp: transazione[1]
        });
      });
    }).finally(() => {
      console.log('Transazioni set');
      //usa le prime 9 transazioni di cur8
  //cicla
      for (let i = 0; i < 10; i++) {
        this.fetchPostDataCiclo(this.transazioniCUR8[i].author);
      } 
    });
  }

}
