import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Client } from 'dsteem';
import { ApiService } from './api.service';
import { Utils } from '../classes/my_utils';
import { VoteTransaction } from '../classes/biz/hive-user';
import { GlobalPrezzi, IMRiddData, MyPost, OutputFetchPostDC, SteemData } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GlobalPropertiesSteemService {

  private client = new Client('https://api.moecki.online');

  private _globalProperties = new BehaviorSubject<{
    totalVestingFundSteem: number,
    totalVestingShares: number
  }>({
    totalVestingFundSteem: 0,
    totalVestingShares: 0
  });
  globalProperties$ = this._globalProperties.asObservable();

  private _accountCUR8 = new BehaviorSubject<any>(null);
  accountCUR8$ = this._accountCUR8.asObservable();

  private _imridData = new BehaviorSubject<IMRiddData>({
    delegaCur8: 0,
    ultimoPagamento: 0
  });
  imridData$ = this._imridData.asObservable();

  private _delegatori = new BehaviorSubject<number>(0);
  delegatori$ = this._delegatori.asObservable();

  private _transazioniCUR8 = new BehaviorSubject<VoteTransaction[]>([]);
  transazioniCUR8$ = this._transazioniCUR8.asObservable();

  private _globalPrezzi = new BehaviorSubject<GlobalPrezzi>({ price: 0, price_dollar: 0 });
  globalPrezzi$ = this._globalPrezzi.asObservable();

  private _dataChart = new BehaviorSubject<SteemData[]>([]);
  dataChart$ = this._dataChart.asObservable();

  private _allTimePayOut_DA_MOLTIPLICARE = new BehaviorSubject<number>(0);
  allTimePayOut_DA_MOLTIPLICARE$ = this._allTimePayOut_DA_MOLTIPLICARE.asObservable();

  private _daysPayout_DA_MOLTIPLICARE = new BehaviorSubject<number>(0);
  daysPayout_DA_MOLTIPLICARE$ = this._daysPayout_DA_MOLTIPLICARE.asObservable();

  private _listaPost = new BehaviorSubject<MyPost[]>([]);
  listaPost$ = this._listaPost.asObservable();

  constructor(private apiService: ApiService) {
    this.initGlobalProperties();
    this.fetchHiveData();
    this.setPrices();
    this.fetchAccountData('cur8');
    this.fetchVestingDelegations('jacopo.eth', 'cur8');
    this.fetchAccountHistory('jacopo.eth');
    this.fetchDelegatori();
    this.fetchSteemChart();
    this.setTransazioniCur8();
  }

  private async initGlobalProperties(): Promise<void> {
    const result = await this.client.database.getDynamicGlobalProperties();
    this._globalProperties.next({
      totalVestingFundSteem: Utils.toStringParseFloat(result.total_vesting_fund_steem),
      totalVestingShares: Utils.toStringParseFloat(result.total_vesting_shares)
    });
  }

  private async fetchAccountData(account: string): Promise<void> {
    const data = await this.client.database.getAccounts([account]);
    this._accountCUR8.next(data[0]);
  }

  private async fetchVestingDelegations(from: string, to: string): Promise<void> {
    const result = await this.client.database.getVestingDelegations(from, to, 1000);
    if (result.length > 0) {
      const imridData = this._imridData.getValue();
      imridData.delegaCur8 = Utils.vestingShares2HP(
        Utils.toStringParseFloat(result[0].vesting_shares),
        this._globalProperties.getValue().totalVestingFundSteem,
        this._globalProperties.getValue().totalVestingShares
      );
      this._imridData.next(imridData);
    }
  }

  private async fetchAccountHistory(account: string): Promise<void> {
    const result = await this.client.database.call('get_account_history', [account, -1, 1000]);
    const transferTransaction = result.reverse().find((transazione: { op: any; }[]) => {
      const op = transazione[1].op;
      return op[0] === 'transfer' && op[1]['from'] === 'cur8';
    });
    if (transferTransaction) {
      const importo = transferTransaction[1].op[1]['amount'];
      const imridData = this._imridData.getValue();
      imridData.ultimoPagamento = parseFloat(importo.toString());
      this._imridData.next(imridData);
    }
  }

  private async fetchDelegatori(): Promise<void> {
    const result = await this.apiService.get('https://sds0.steemworld.org/delegations_api/getIncomingDelegations/cur8');
    this._delegatori.next(result.result.rows.length);
  }

  private async fetchHiveData(): Promise<void> {
    const data = await this.apiService.get('https://imridd.eu.pythonanywhere.com/api/steem');
    this._allTimePayOut_DA_MOLTIPLICARE.next(data[0]['total_rewards']);
    this._daysPayout_DA_MOLTIPLICARE.next(data[0]['curation_rewards_7d']);
  }

  private async fetchSteemChart(): Promise<void> {
    const data = await this.apiService.get('https://imridd.eu.pythonanywhere.com/api/steem_cur');
    this._dataChart.next(data);
  }
//https://.com'
  private async fetchPostDataCiclo(autor: string): Promise<OutputFetchPostDC> {
    const query = { tag: autor, limit: 1 };
    try {
      console.log('Fetching discussions with query:', query);
      const result = await this.client.database.getDiscussions('blog', query);
      
      if (result.length === 0) {
        console.warn('No discussions found for author:', autor);
        return { trovato: false, post: null };
      }
  
      const post = result[0];
      console.log('Fetched post:', post);
  
      const metadata = JSON.parse(post.json_metadata);
      console.log('Parsed metadata:', metadata);
  
      if (metadata.image.length > 0 ) {
        const imageUrl =  metadata.image[0] ;
        const output = {
          trovato: true, 
          post: {
            author: post.author,
            title: post.title,
            imageUrl: imageUrl,
            url: 'https://steemit.com' + post.url
          }
        };
        console.log('Post found with image:', output.post);
        return output;
      } else {
        console.warn('No images found in metadata for post:', post);
        return { trovato: false, post: null };
      }
    } catch (error) {
      console.error('Errore durante il recupero dei dati del post per l\'autore:', autor, 'con query:', query, 'Errore:', error);
      return { trovato: false, post: null };
    }
  }

  public async setPrices(): Promise<void> {
    const result = await this.apiService.get('https://imridd.eu.pythonanywhere.com/api/prices');
    this._globalPrezzi.next({
      price: result['STEEM'],
      price_dollar: result['SBD']
    });
  }

  private async setTransazioniCur8(): Promise<void> {
    try {
      const _3DaysAgo = new Date();
      _3DaysAgo.setDate(_3DaysAgo.getDate() - 4);
      const today = new Date();
      const baseUrl = 'https://sds.steemworld.org/account_history_api/getHistoryByOpTypesTime/cur8/vote/';
      const url = baseUrl + Math.floor(_3DaysAgo.getTime() / 1000) + '-' + Math.floor(today.getTime() / 1000);
      const result = await this.apiService.get(url);
      const muta = result.result.rows;
      const transazioniCUR8: VoteTransaction[] = this.transformAccountHistoryToTransactions(muta);
      this.updateTransazioniCUR8(transazioniCUR8);
      await this.processTransactions(transazioniCUR8);
    } catch (error) {
      console.error("Errore nel setTransazioniCur8", error);
    }
  }

  private transformAccountHistoryToTransactions(result: any): VoteTransaction[] {
    return result.map((transazione: any) => ({
      voter: transazione[6][1].voter,
      author: transazione[6][1].author,
      weight: transazione[6][1].weight,
      timestamp: transazione[1]
    })) as VoteTransaction[];
  }

  private updateTransazioniCUR8(transazioniCUR8: VoteTransaction[]): void {
    this._transazioniCUR8.next(transazioniCUR8);
  }

  private async processTransactions(transazioniCUR8: VoteTransaction[]): Promise<void> {
    let i = transazioniCUR8.length - 1;
    const currentPosts = this._listaPost.getValue();

    while (i >= 0 && currentPosts.length < 9) {
      const ofPdc = await this.fetchPostDataCiclo(transazioniCUR8[i].author);

      if (ofPdc.trovato && ofPdc.post) {
        console.log(ofPdc.post);
        currentPosts.push(ofPdc.post);
        this._listaPost.next(currentPosts);
      }
      i--;
    }
  }

  public getGlobalProperties(): any {
    return this._globalProperties.getValue();
  }

  public getAccountCUR8(): any {
    return this._accountCUR8.getValue();
  }

  public getImridData(): IMRiddData {
    return this._imridData.getValue();
  }

  public getDelegatori(): number {
    return this._delegatori.getValue();
  }

  public getGlobalPrezzi(): GlobalPrezzi {
    return this._globalPrezzi.getValue();
  }

  public getDataChart(): SteemData[] {
    return this._dataChart.getValue();
  }

  public getListaPost(): MyPost[] {
    return this._listaPost.getValue();
  }

  public getAllTimePayOut_DA_MOLTIPLICARE(): number {
    return this._allTimePayOut_DA_MOLTIPLICARE.getValue();
  }

  public getDaysPayout_DA_MOLTIPLICARE(): number {
    return this._daysPayout_DA_MOLTIPLICARE.getValue();
  }

  public getTransazioniCUR8(): VoteTransaction[] {
    return this._transazioniCUR8.getValue();
  }

  public setDataChart(data: SteemData[]) {
    this._dataChart.next(data);
  }
  public setDelegatori(length: any) {
    this._delegatori.next(length);
  }
  public setDaysPayout_DA_MOLTIPLICARE(arg0: any) {
    this._daysPayout_DA_MOLTIPLICARE.next(arg0);
  }
  public setAllTimePayOut_DA_MOLTIPLICARE(arg0: any) {
    this._allTimePayOut_DA_MOLTIPLICARE.next(arg0);
  }

  public setAccountCUR8(account: any) {
    this._accountCUR8.next(account);
  }

  public setGlobalPrezzi(arg0: { price: any; price_dollar: any; }) {
    this._globalPrezzi.next(arg0);
  }

}
