import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { NgFor } from '@angular/common';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';

import { MatCard, MatCardContent, MatCardSubtitle, MatCardTitle, MatCardActions, MatCardHeader, MatCardAvatar, MatCardFooter, MatCardImage, MatCardSmImage, MatCardModule } from '@angular/material/card';
import { MatGridTile, MatGridList, MatGridAvatarCssMatStyler, MatGridTileFooterCssMatStyler, MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { DateFormatPipe } from "../pipes/date-format.pipe";
import { TruncatePipe } from "../pipes/truncate.pipe";
import { Vest2HPPipe } from "../pipes/vest2-hp.pipe";
import { ColoreRankDirective } from '../directives/colore-rank.directive';
import { MatTableModule } from '@angular/material/table';
import { StaticDelegator } from '../classes/biz/delegator';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserMemoryService } from '../services/user-memory.service';
import { ReversePadZeroPipe } from "../pipes/reverse-pad-zero.pipe";
import { GlobalPropertiesService } from '../services/global-properties.service';
import { IMRiddData } from '../interfaces/interfaces';
import { User, UserFactory } from '../classes/biz/steem-user';
import { GlobalPropertiesSteemService } from '../services/global-properties-steem.service';
import { UserMemorySteemService } from '../services/user-memory-steem.service';


@Component({
  selector: 'app-steem',
  standalone: true,
  templateUrl: './steem.component.html',
  styleUrl: './steem.component.scss',
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
export class SteemComponent {
  estimatedDailyProfit: number = 0;

  imridData: IMRiddData = {
    delegaCur8: 0,
    ultimoPagamento: 0
  }
  global_properties: { totalVestingFundSteem: number; totalVestingShares: number; };

  changeDailyProfit() {
    const apr = this.imridData.ultimoPagamento * 365 * 100 / this.imridData.delegaCur8;
    this.estimatedDailyProfit = this.valoreDelega * apr / 365 / 100;
  }

  valoreDelega = 0;
  user: User = {
    expiringDelegations: [],
    image: '',
    transactions: [],
    global_properties: {
      totalVestingFundSteem: 0,
      totalVestingShares: 0,
    },
    username: '',
    platform: 'STEEM',
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
    { ammount: 100, expDate: '2021-01-01' },
    { ammount: 200, expDate: '2021-01-01' }
  ];
  search: any;
  isLoading = true;
  loaded = false;
  imridAccoount: any;
  constructor(private gs:GlobalPropertiesSteemService,private userMemoryService: UserMemorySteemService) {

    this.global_properties = this.gs.global_properties;
    this.user.global_properties = this.global_properties;
    this.imridData = this.gs.imridData;


     if (this.userMemoryService.user) {
       this.user = this.userMemoryService.user;
       this.loaded = true;
     }
    this.isLoading = false;
  }

  refresh() {
    this.isLoading = true;
    UserFactory.getUser(this.user.username, this.gs.global_properties).then((user: User) => {
      this.user = user;
      this.isLoading = false;
      this.loaded = true;
      this.userMemoryService.setUser(this.user)
    });
  }

  delega() {
    StaticDelegator.delegateWithSteem(this.user.username, 'cur8', this.valoreDelega.toString(), () => { console.log('fatto') }).then((result) => {
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
