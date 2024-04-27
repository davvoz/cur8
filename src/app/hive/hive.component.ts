import { Component, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { NgFor } from '@angular/common';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { User, UserFactory } from '../classes/biz/hive-user';
import { MatCard, MatCardContent, MatCardSubtitle, MatCardTitle, MatCardActions, MatCardHeader, MatCardAvatar, MatCardFooter, MatCardImage, MatCardSmImage, MatCardModule } from '@angular/material/card';
import { MatGridTile, MatGridList, MatGridAvatarCssMatStyler, MatGridTileFooterCssMatStyler, MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { DateFormatPipe } from "../pipes/date-format.pipe";
import { TruncatePipe } from "../pipes/truncate.pipe";
import { Vest2HPPipe } from "../pipes/vest2-hp.pipe";
import { ColoreRankDirective } from '../directives/colore-rank.directive';
import { MatTableModule } from '@angular/material/table';
import { StaticDelegator } from '../classes/biz/delegator';
//forms module
import { FormsModule } from '@angular/forms';
//spinner 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserMemoryService } from '../services/user-memory.service';
import { ReversePadZeroPipe } from "../pipes/reverse-pad-zero.pipe";
import { Client } from '@hiveio/dhive';
import { Utils } from '../classes/my_utils';

interface IMRiddData {
  delegaCur8: number;
  ultimoPagamento: number;
}

@Component({
  selector: 'app-hive',
  standalone: true,
  templateUrl: './hive.component.html',
  styleUrl: './hive.component.scss',
  imports: [
    MatProgressSpinnerModule,
    FormsModule,
    MatTableModule,
    ColoreRankDirective,
    MatListModule,
    MatCardModule,
    MatCardImage,
    MatCardSmImage,
    MatCardFooter,
    MatGridAvatarCssMatStyler,
    MatGridTileFooterCssMatStyler,
    MatGridTileHeaderCssMatStyler,
    MatGridTile,
    MatGridList,
    MatExpansionPanel,
    MatCardActions,
    MatCardHeader,
    MatCardAvatar,
    MatCardSubtitle,
    MatCardTitle,
    MatDivider,
    MatAccordion,
    MatIcon,
    MatLabel,
    MatButton,
    MatCard,
    MatCardContent,
    NgIf,
    NgFor,
    DateFormatPipe,
    TruncatePipe,
    Vest2HPPipe,
    ReversePadZeroPipe
  ]
})

export class HiveComponent {
  estimatedDailyProfit: number = 0;
  imridData: IMRiddData = {
    delegaCur8: 0,
    ultimoPagamento: 0
  }
  global_properties = {
    totalVestingFundHive: 0,
    totalVestingShares: 0
  }

  changeDailyProfit() {
    console.log(this.imridData.delegaCur8);
    const apr = this.imridData.ultimoPagamento * 365 * 100 / this.imridData.delegaCur8;
    console.log(apr);
    this.estimatedDailyProfit = this.valoreDelega * apr / 365 /100  ;
  }

  valoreDelega = 0;
  user: User = {
    expiringDelegations: [],
    image: '',
    transactions: [],
    global_properties: {
      totalVestingFundHive: 0,
      totalVestingShares: 0,
    },
    username: '',
    platform: 'HIVE',
    rapportoConCUR8: {
      delega: 0,
      share: 0,
      ultimoPagamento: {
        data: new Date(),
        importo: 0
      },
      estimatedDailyProfit: 0,
      powerDisponibili: 0
    },
    valutes: {
      HIVE: 0,
      HBD: 0,
      HP: 0
    },
    social: {
      followers: 0,
      following: 0,
      postsNumber: 0,
      level: 0
    },
    account_value: 0,
  };

  displayedColumns = ['account', 'ammount', 'exp date'];

  delegations = [
    { ammount: 100, expDate: '2021-01-01' },
    { ammount: 200, expDate: '2021-01-01' }
  ];
  search: any;
  isLoading = true;
  loaded = false;
  imridAccoount: any;
  constructor(private userMemoryService: UserMemoryService) {

    const client = new Client('https://api.hive.blog');

    client.database.getDynamicGlobalProperties().then((result) => {
      this.global_properties.totalVestingFundHive = parseFloat(result.total_vesting_fund_hive.toString());
      this.global_properties.totalVestingShares = parseFloat(result.total_vesting_shares.toString());
    });

    client.database.getVestingDelegations('jacopo.eth', 'cur8', 1000).then((result) => {
      this.imridData.delegaCur8 = Utils.vestingShares2HP(parseFloat(result[0].vesting_shares.toString()), this.global_properties.totalVestingFundHive, this.global_properties.totalVestingShares);
    });

    let listaDiTransazioni: any[] = [];

    client.database.getAccountHistory('jacopo.eth', -1, 1000).then((result) => {
      listaDiTransazioni = result;
      let op: any[] = [];
      const transferTransaction = listaDiTransazioni.reverse().find(transazione => {
        op = transazione[1].op;
        return op[0] === 'transfer' && op[1]['from'] === 'cur8';
      });
      console.log(transferTransaction);
      let importo = 0;
      console.log(op);
      if (transferTransaction) {
        importo = op[1]['amount'];
      }
      console.log(importo);
      this.imridData.ultimoPagamento = parseFloat(importo.toString());
      console.log(this.imridData);
    });

    if (this.userMemoryService.userName) {
      this.user.username = this.userMemoryService.userName;
      this.refresh();
    } else {
      this.isLoading = false;
    }
  }

  refresh() {

    this.isLoading = true;
    UserFactory.getUser(this.user.username).then((user: User) => {
      console.log(user);
      this.user = user;
      this.isLoading = false;
      this.loaded = true;
      this.userMemoryService.setUser(this.user.username)
    });
  }

  delega() {
    StaticDelegator.delegateWithHive(this.user.username, 'cur8', this.valoreDelega.toString(), () => { console.log('fatto') }).then((result) => {
      console.log('delega effettuata');
    }).catch((error) => {
      console.log('errore nella delega');
    });

  }

  searchTrans() {
    throw new Error('Method not implemented.');
  }

  searchTransaction() {
    throw new Error('Method not implemented.');
  }

}