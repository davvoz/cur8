import { Injectable } from '@angular/core';
import { IMRiddData } from '../interfaces/interfaces';
import { Client } from 'dsteem';
import { Utils } from '../classes/my_utils';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalPropertiesSteemService {
  global_properties = {
    totalVestingFundSteem: 0,
    totalVestingShares: 0
  }
  accountCUR8: any;
  imridData: IMRiddData = {
    delegaCur8: 0,
    ultimoPagamento: 0
  }
  totalSteemRecieved = 0;
  delegatori: any;

  constructor(apiService: ApiService) {
    const client = new Client('https://api.moecki.online');
    client.database.getDynamicGlobalProperties().then((result) => {
      this.global_properties.totalVestingFundSteem = Utils.toStringParseFloat(result.total_vesting_fund_steem);
      this.global_properties.totalVestingShares = Utils.toStringParseFloat(result.total_vesting_shares);
    });

    client.database.getAccounts(['cur8']).then((data) => {
      console.log(data);
      this.accountCUR8 = data[0];
    });

    client.database.getVestingDelegations('jacopo.eth', 'cur8', 1000).then((result) => {
      this.imridData.delegaCur8 = Utils.vestingShares2HP(
        Utils.toStringParseFloat(result[0].vesting_shares),
        this.global_properties.totalVestingFundSteem,
        this.global_properties.totalVestingShares);
    });

    client.database.call('get_account_history', ['jacopo.eth', -1, 1000]).then((result) => {
      const listaDiTransazioni = result;
      let op: any;
      const transferTransaction = listaDiTransazioni.reverse().find((transazione: { op: any; }[]) => {
        op = transazione[1].op;
        return op[0] === 'transfer' && op[1]['from'] === 'cur8';
      });
      let importo = 0;
      if (transferTransaction) {
        importo = op[1]['amount'];
      }
      this.imridData.ultimoPagamento = parseFloat(importo.toString());
    });

    apiService.get('https://sds0.steemworld.org/delegations_api/getIncomingDelegations/cur8').then((result) => {
      console.log(result);
      this.delegatori = result.result.rows.length;
    });

  }
}