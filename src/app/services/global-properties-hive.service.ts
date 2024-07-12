import { Injectable } from '@angular/core';
import { Client, DisqussionQuery } from '@hiveio/dhive';
import { Utils } from '../classes/my_utils';
import { GlobalPrezzi, HiveData, IMRiddData, MyPost, OutputFetchPostDC } from '../interfaces/interfaces';
import { ApiService } from './api.service';
import { VoteTransaction } from '../classes/biz/hive-user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalPropertiesHiveService {

  private _globalProperties = new BehaviorSubject<{
    totalVestingFundHive: number, totalVestingShares: number
  }>({
    totalVestingFundHive: 0,
    totalVestingShares: 0
  });
  globalProperties$ = this._globalProperties.asObservable();

  private _accountCUR8 = new BehaviorSubject<any>(null);
  accountCUR8$ = this._accountCUR8.asObservable();

  private _imridData = new BehaviorSubject<IMRiddData>({ delegaCur8: 0, ultimoPagamento: 0 });
  imridData$ = this._imridData.asObservable();

  private _delegatori = new BehaviorSubject<number>(0);
  delegatori$ = this._delegatori.asObservable();

  private _transazioniCUR8 = new BehaviorSubject<VoteTransaction[]>([]);
  transazioniCUR8$ = this._transazioniCUR8.asObservable();

  private _globalPrezzi = new BehaviorSubject<GlobalPrezzi>({ price: 0, price_dollar: 0 });
  globalPrezzi$ = this._globalPrezzi.asObservable();

  private _dataChart = new BehaviorSubject<HiveData[]>([]);
  dataChart$ = this._dataChart.asObservable();

  private _listaPost = new BehaviorSubject<MyPost[]>([]);
  listaPost$ = this._listaPost.asObservable();

  private _allTimePayOut_DA_MOLTIPLICARE = new BehaviorSubject<number>(0);
  allTimePayOut_DA_MOLTIPLICARE$ = this._allTimePayOut_DA_MOLTIPLICARE.asObservable();

  private _daysPayout_DA_MOLTIPLICARE = new BehaviorSubject<number>(0);
  daysPayout_DA_MOLTIPLICARE$ = this._daysPayout_DA_MOLTIPLICARE.asObservable();

  private client: Client;

  constructor(private apiService: ApiService) {
    this.client = new Client('https://api.hive.blog');
    this.initGlobalProperties();
    this.fetchAccountData('cur8');
    this.fetchVestingDelegations('jacopo.eth', 'cur8');
    this.fetchAccountHistory('jacopo.eth');
    this.fetchDelegatori();
    this.fetchHiveData();
    this.setPrices();
    this.setTransazioniCur8();
  }

  private async initGlobalProperties(): Promise<void> {
    const result = await this.client.database.getDynamicGlobalProperties();
    this._globalProperties.next({
      totalVestingFundHive: Utils.toStringParseFloat(result.total_vesting_fund_hive),
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
      const globalProps = this._globalProperties.getValue();
      this._imridData.next({
        ...this._imridData.getValue(),
        delegaCur8: Utils.vestingShares2HP(
          Utils.toStringParseFloat(result[0].vesting_shares),
          globalProps.totalVestingFundHive,
          globalProps.totalVestingShares
        )
      });
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
      this._imridData.next({
        ...this._imridData.getValue(),
        ultimoPagamento: parseFloat(importo.toString())
      });
    }
  }

  private async fetchDelegatori(): Promise<void> {
    const result = await this.apiService.get('https://ecency.com/private-api/received-vesting/cur8');
    this._delegatori.next(result['list'].length);
  }

  private async fetchHiveData(): Promise<void> {
    const data = await this.apiService.get('https://imridd.eu.pythonanywhere.com/api/hive_cur');
    this._dataChart.next(data);
  }

  private async fetchPostDataCiclo(vote: VoteTransaction): Promise<OutputFetchPostDC> {
   
    if (vote.voter !== 'cur8' || vote.weight < 3000) {
      const asyncFunction = async () => {
        return { trovato: false, post: null };
      }
      return asyncFunction();
    }

    const query: DisqussionQuery = {
      tag: vote.author,
      start_author: vote.author,
      start_permlink: vote.id + '',
      limit: 1
    };
    try {
      const result = await this.client.database.getDiscussions('blog', query);
      if (result.length === 0) {
        console.warn('No discussions found for author:', vote.author, 'with query:', query);
        return { trovato: false, post: null };
      }
      //controlliamo se il post è stato votato da cur8 con un peso maggiore di 3000
      const voted = result[0].active_votes.find(voto => voto.voter === 'cur8');
      if (voted === undefined || voted.percent < 3000) {
        return { trovato: false, post: null };
      }

      const post = result[0];

      const metadata = JSON.parse(post.json_metadata);


      if ((metadata.image && metadata.image.length > 0) || (metadata.images && metadata.images.length > 0)) {
        const imageUrl = metadata.image ? metadata.image[0] : metadata.images[0];
        const output = {
          trovato: true,
          post: {
            author: post.author,
            title: post.title,
            imageUrl: imageUrl,
            url: 'https://peakd.com' + post.url,
            weight: vote.weight
          }
        };
        return output;
      } else {
        return { trovato: false, post: null };
      }
    } catch (error) {
      console.error('Errore durante il recupero dei dati del post per l\'autore:', vote.author, 'e il permlink:', vote.id, error);
      return { trovato: false, post: null };
    }
  }


  public async setPrices(): Promise<void> {
    if (this._globalPrezzi.getValue().price === 0) {
      const result = await this.apiService.get('https://imridd.eu.pythonanywhere.com/api/prices');
      this._globalPrezzi.next({
        price: result['HIVE'],
        price_dollar: result['HBD']
      });
    }
  }

  private async setTransazioniCur8(): Promise<void> {
    try {
      const result = await this.getAccountHistory('cur8', -1, 1000, [1, 40]);
      const transazioniCUR8 = this.transformAccountHistoryToTransactions(result);
      this.updateTransazioniCUR8(transazioniCUR8);
      await this.processTransactions(transazioniCUR8);
    } catch (error) {
      console.error('Errore durante il recupero della cronologia dell\'account o dei dati del post:', error);
    }
  }

  private async getAccountHistory(account: string, start: number, limit: number, types: [number, number]): Promise<any> {
    return await this.client.database.getAccountHistory(account, start, limit, types);
  }

  private transformAccountHistoryToTransactions(result: any): VoteTransaction[] {
    return result.map((transazione: any) => ({
      voter: transazione[1].op[1]['voter'],
      author: transazione[1].op[1]['author'],
      weight: transazione[1].op[1]['weight'],
      timestamp: transazione[1].timestamp,
      id: transazione[1].op[1]['permlink']

    })) as VoteTransaction[];
  }

  private updateTransazioniCUR8(transazioniCUR8: VoteTransaction[]): void {
    this._transazioniCUR8.next(transazioniCUR8);
  }

  private async processTransactions(transazioniCUR8: VoteTransaction[]): Promise<void> {
    let i = transazioniCUR8.length - 1;
    const currentPosts = this._listaPost.getValue();

    while (i >= 0 && currentPosts.length < 9) {
      const ofPdc = await this.fetchPostDataCiclo(transazioniCUR8[i]);

      if (ofPdc.trovato && ofPdc.post) {
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

  public getDataChart(): HiveData[] {
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

  public setDataChart(data: HiveData[]) {
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
}
