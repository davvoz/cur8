import { Injectable } from '@angular/core';
import { Client } from '@hiveio/dhive';
import { Utils } from '../classes/my_utils';
import { GlobalPrezzi, HiveData, IMRiddData, MyPost } from '../interfaces/interfaces';
import { ApiService } from './api.service';
import { VoteTransaction } from '../classes/biz/hive-user';

@Injectable({
  providedIn: 'root'
})
export class GlobalPropertiesHiveService {
  globalProperties = {
    totalVestingFundHive: 0,
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
    this.client = new Client('https://api.hive.blog');
    this.initGlobalProperties();
    this.fetchAccountData('cur8');
    this.fetchVestingDelegations('jacopo.eth', 'cur8');
    this.fetchAccountHistory('jacopo.eth');
    this.fetchDelegatori();
    this.fetchHiveData();
    //this.fetchPostData('cur8', 10);
    this.setPrices();
    this.setTransazioniCur8();
  }

  private async initGlobalProperties(): Promise<void> {
    const result = await this.client.database.getDynamicGlobalProperties();
    this.globalProperties.totalVestingFundHive = Utils.toStringParseFloat(result.total_vesting_fund_hive);
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
        this.globalProperties.totalVestingFundHive,
        this.globalProperties.totalVestingShares
      );
    }
  }

  private async fetchAccountHistory(account: string): Promise<void> {
    const result = await this.client.database.getAccountHistory(account, -1, 1000);
    const transferTransaction = result.reverse().find(transazione => {
      const op = transazione[1].op;
      return op[0] === 'transfer' && op[1]['from'] === 'cur8';
    });
    if (transferTransaction) {
      const importo = transferTransaction[1].op[1]['amount'];
      this.imridData.ultimoPagamento = parseFloat(importo.toString());
    }
  }

  private async fetchDelegatori(): Promise<void> {
    const result = await this.apiService.get('https://ecency.com/private-api/received-vesting/cur8');
    this.delegatori = result['list'].length;
  }

  private async fetchHiveData(): Promise<void> {
    const data = await this.apiService.get('https://imridd.eu.pythonanywhere.com/api/hive_cur');
    this.dataChart = data;
  }

  async fetchPostDataCiclo(autor: string): Promise<void> {

    const query = { tag: autor, limit: 1, };
    const result = await this.client.database.getDiscussions('blog', query);
    const metadata = JSON.parse(result[0].json_metadata);
    if (metadata.image) {
      this.listaPost.push({
        title: result[0].title,
        imageUrl: metadata.image[0],
        url: 'https://peakd.com' + result[0].url
      });

    }
  }
  async setPrices(): Promise<void> {
    if (this.globalPrezzi.price === 0) {
      const result = await this.apiService.get('https://imridd.eu.pythonanywhere.com/api/prices');
      this.globalPrezzi.price = result['HIVE'];
      this.globalPrezzi.price_dollar = result['HBD'];
      console.log('Hive prices set');
    }
  }

  private async setTransazioniCur8(): Promise<void> {
    const result = await this.client.database.getAccountHistory('cur8', -1, 1000, [1, 40]);
    this.transazioniCUR8 = result.map(transazione => ({
      voter: transazione[1].op[1]['voter'],
      author: transazione[1].op[1]['author'],
      weight: transazione[1].op[1]['weight'],
      timestamp: transazione[1].timestamp
    }));
    console.log('Transazioni set');
    console.log('Ciclo post',this.transazioniCUR8.length);

    for (let i = this.transazioniCUR8.length -1; i > this.transazioniCUR8.length - 14; i--) {
      this.fetchPostDataCiclo(this.transazioniCUR8[i].author);
    }
  }

}
