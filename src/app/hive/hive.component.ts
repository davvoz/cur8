import { Component, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { NgFor } from '@angular/common';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { User, UserFactory } from '../interfaces/interfaces';
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
    Vest2HPPipe]
})

export class HiveComponent {

  valoreDelega = 0;
  user: User = {
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
      HP: 0,
      STEEM: 0,
      SBD: 0,
      SP: 0
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
    { account: 'im-ridd', ammount: 100, expDate: '2021-01-01' },
    { account: 'im-ridd', ammount: 200, expDate: '2021-01-01' }
  ];
  search: any;
  isLoading = true;
  loaded = false;

  constructor(private userMemoryService: UserMemoryService) {
    if (!this.userMemoryService.userName) {
      const userFactory: UserFactory = new UserFactory();
      userFactory.creaUser('', 'HIVE').then((user: User) => {
        this.user = user;
      }).finally(() => {
        this.isLoading = false;
      });
    } else {
      this.user.username = this.userMemoryService.userName;
      this.refresh();
    }
  }

  refresh() {

    this.isLoading = true;
    const userFactory: UserFactory = new UserFactory();
    userFactory.creaUser(this.user.username, 'HIVE').then((user: User) => {
      this.user = user;
    }).then(() => {
      this.isLoading = false;
      this.loaded = true;
      this.userMemoryService.setUser(this.user.username);
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