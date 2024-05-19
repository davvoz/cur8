import { Injectable } from '@angular/core';
import { Client } from '@hiveio/dhive';
import { GlobalPrezzi, Utils } from '../classes/my_utils';
import { HiveData, IMRiddData } from '../interfaces/interfaces';
import { ApiService } from './api.service';
import { VoteTransaction } from '../classes/biz/hive-user';

@Injectable({
  providedIn: 'root'
})
export class GlobalPropertiesHiveService {
  global_properties = {
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

  global_prezzi: GlobalPrezzi = {
    price: 0,
    price_dollar: 0
  }

  dataChart: HiveData[] = [];
  allTimePayOut_DA_MOLTIPLICARE = 0;
  days_payout_DA_MOLTIPLICARE = 0;
  listaPost: any[] = [];

  constructor(private apiService: ApiService) {

    const client = new Client('https://api.hive.blog');

    client.database.getDynamicGlobalProperties().then((result) => {
      this.global_properties.totalVestingFundHive = Utils.toStringParseFloat(result.total_vesting_fund_hive);
      this.global_properties.totalVestingShares = Utils.toStringParseFloat(result.total_vesting_shares);
    });

    client.database.getAccounts(['cur8']).then((data) => {
      console.log(data);
      this.accountCUR8 = data[0];
    });

    client.database.getVestingDelegations('jacopo.eth', 'cur8', 1000).then((result) => {
      this.imridData.delegaCur8 = Utils.vestingShares2HP(
        Utils.toStringParseFloat(result[0].vesting_shares),
        this.global_properties.totalVestingFundHive,
        this.global_properties.totalVestingShares);
    });

    client.database.getAccountHistory('jacopo.eth', -1, 1000).then((result) => {
      const listaDiTransazioni = result;
      let op: any;
      const transferTransaction = listaDiTransazioni.reverse().find(transazione => {
        op = transazione[1].op;
        return op[0] === 'transfer' && op[1]['from'] === 'cur8';
      });
      let importo = 0;
      if (transferTransaction) {
        importo = op[1]['amount'];
      }
      this.imridData.ultimoPagamento = parseFloat(importo.toString());
    });



    apiService.get('https://ecency.com/private-api/received-vesting/cur8').then((result) => {
      this.delegatori = result['list'].length;
    });

    apiService.get('https://imridd.eu.pythonanywhere.com/api/hive_cur').then((data: HiveData[]) => {
      this.dataChart = data;
    });

    this.apiService.get('https://imridd.eu.pythonanywhere.com/api/hive').then((data) => {
      //follow_count
      this.allTimePayOut_DA_MOLTIPLICARE = data[0]['total_rewards'];
      this.days_payout_DA_MOLTIPLICARE = data[0]['curation_rewards_7d'];
    });
    try {
      const query = {
        tag: 'cur8', // Tag dei post da ottenere, puoi cambiarlo a seconda delle tue esigenze
        limit: 10, // Numero di post da ottenere, puoi cambiarlo a seconda delle tue esigenze
      };

      // Richiesta per ottenere i post
      client.database.getDiscussions('blog', query).then((result) => {
        console.log(result);
        result.forEach((post) => {
          this.listaPost.push(post.body);
        });
      }).finally(() => {
        console.log('Post ottenuti',this.listaPost);
      });
    } catch (error) {
      console.error('Errore durante l\'ottenimento dei post:', error);
    }

  }

  async setPrices(): Promise<void> {
    if (this.global_prezzi.price == 0) {
      await this.apiService.get('https://imridd.eu.pythonanywhere.com/api/prices').then((result) => {
        this.global_prezzi.price = result['HIVE'];
        this.global_prezzi.price_dollar = result['HBD'];
      }).finally(() => {
        console.log('Hive prices set');
      });
    }
  }


  async setTransazioniCur8(): Promise<void> {
    const client = new Client('https://api.hive.blog');

    await client.database.getAccountHistory('cur8', -1, 1000, [1, 40]).then((result) => {
      result.forEach((transazione: any) => {
        const voteTransaction: VoteTransaction = {
          voter: transazione[1].op[1].voter,
          author: transazione[1].op[1].author,
          weight: transazione[1].op[1].weight,
          timestamp: transazione[1].timestamp
        }
        this.transazioniCUR8.push(voteTransaction);
      });
    }).finally(() => {
      console.log('Transazioni set');
    });
  }

}
