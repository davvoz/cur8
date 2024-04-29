import { Injectable } from '@angular/core';
import { Client } from '@hiveio/dhive';
import { Utils } from '../classes/my_utils';
import { IMRiddData } from '../interfaces/interfaces';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalPropertiesService {
  global_properties = {
    totalVestingFundHive: 0,
    totalVestingShares: 0
  }
  accountCUR8: any;
  imridData: IMRiddData = {
    delegaCur8: 0,
    ultimoPagamento: 0
  }
  listaDelegatori: any[] = [];

  constructor() {
    const client = new Client('https://api.hive.blog');
    client.database.getDynamicGlobalProperties().then((result) => {
      this.global_properties.totalVestingFundHive = Utils.toStringParseFloat(result.total_vesting_fund_hive);
      this.global_properties.totalVestingShares = Utils.toStringParseFloat(result.total_vesting_shares);
    });

    client.database.getAccounts(['cur8']).then((data) => {
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

    
  }


}