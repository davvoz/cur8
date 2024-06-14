import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { NgFor } from '@angular/common';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { MatCardModule, MatCardImage, MatCardSmImage, MatCardFooter, MatCardActions, MatCardHeader, MatCardAvatar, MatCardSubtitle, MatCardTitle, MatCard, MatCardContent } from '@angular/material/card';
import { MatGridAvatarCssMatStyler, MatGridTileFooterCssMatStyler, MatGridTileHeaderCssMatStyler, MatGridTile, MatGridList } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { StaticDelegator } from '../../classes/biz/delegator';
import { User, UserFactory } from '../../classes/biz/hive-user';
import { ColoreRankDirective } from '../../directives/colore-rank.directive';
import { IMRiddData } from '../../interfaces/interfaces';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { ReversePadZeroPipe } from '../../pipes/reverse-pad-zero.pipe';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { Vest2HPPipe } from '../../pipes/vest2-hp.pipe';
import { GlobalPropertiesHiveService } from '../../services/global-properties-hive.service';
import { UserMemoryService } from '../../services/user-memory.service';
import { Utils } from '../../classes/my_utils';
import { MatTooltipModule } from '@angular/material/tooltip';



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
    ReversePadZeroPipe,
    MatTooltipModule
  ]
})

export class HiveComponent {


  powerUpHPValue: any;
  sendTo: any;
  sendAmount: any;
  estimatedDailyProfit: number = 0;
  search: any;
  isLoading = true;
  loaded = false;
  imridAccoount: any;
  valoreDelega = 0;
  displayedColumns = ['account', 'ammount', 'exp date'];
  imridData: IMRiddData = {
    delegaCur8: 0,
    ultimoPagamento: 0
  }
  global_properties: { totalVestingFundHive: number; totalVestingShares: number; };
  user: User = {
    expiringDelegations: [],
    image: '',
    transactions: [],
    global_properties: {
      totalVestingFundHive: 0,
      totalVestingShares: 0,
    },
    totalExpiringDelegations: 0,
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
  delegations = [
    { ammount: 100, expDate: '2021-01-01' },
    { ammount: 200, expDate: '2021-01-01' }
  ];
  isMobile = false;
  sommaExpire = 0;
  defaultImage = '/assets/default_user.jpg';
  usernameView: any;

  constructor(private userMemoryService: UserMemoryService, public gs: GlobalPropertiesHiveService) {
    this.isMobile = window.innerWidth < 768;
    this.global_properties = this.gs.globalProperties;
    this.user.global_properties = this.gs.globalProperties;

    this.sommaExpire = Utils.vestingShares2HP(
      this.user.expiringDelegations.reduce((acc, val) => acc + val.vesting_shares, 0),
      this.user.global_properties.totalVestingFundHive,
      this.user.global_properties.totalVestingShares);

    this.imridData = this.gs.imridData;

    if (this.userMemoryService.user) {
      this.user = this.userMemoryService.user;
      this.usernameView = this.user.username;
      this.loaded = true;
    }
    this.isLoading = false;
  }

  sendHbd() {
    if ((window as any).hive_keychain) {
      const keychain = (window as any).hive_keychain;
      if (typeof this.sendAmount == 'string') {
        this.sendAmount = parseFloat(this.sendAmount);
      }
      this.sendAmount = this.sendAmount.toFixed(3);
      keychain.requestTransfer(this.user.username, this.sendTo, this.sendAmount, '', 'HBD', (response: any) => {
        console.log(response);
      });
    }
  }

  sendHive() {
    if ((window as any).hive_keychain) {
      const keychain = (window as any).hive_keychain;
      if (typeof this.sendAmount == 'string') {
        this.sendAmount = parseFloat(this.sendAmount);
      }
      this.sendAmount = this.sendAmount.toFixed(3);
      keychain.requestTransfer(this.user.username, this.sendTo, this.sendAmount, '', 'HIVE', (response: any) => {
        console.log(response);
      });
    }
  }

  changeDailyProfit() {
    const apr = this.imridData.ultimoPagamento * 365 * 100 / this.imridData.delegaCur8;
    this.estimatedDailyProfit = this.valoreDelega * apr / 365 / 100;
  }

  powerUpHP() {
    if ((window as any).hive_keychain) {
      const keychain = (window as any).hive_keychain;
      if (typeof this.powerUpHPValue == 'string') {
        this.powerUpHPValue = parseFloat(this.powerUpHPValue);
      }
      this.powerUpHPValue = this.powerUpHPValue.toFixed(3);
      keychain.requestPowerUp(this.user.username, this.user.username, this.powerUpHPValue, (response: any) => {
        console.log(response);
      });
    }
  }


  powerDownHP() {
    if ((window as any).hive_keychain) {
      const keychain = (window as any).hive_keychain;
      if (typeof this.powerUpHPValue == 'string') {
        this.powerUpHPValue = parseFloat(this.powerUpHPValue);
      }

      this.powerUpHPValue = this.powerUpHPValue.toFixed(3);
      keychain.requestPowerDown(this.user.username, this.powerUpHPValue, (response: any) => {
        console.log(response);

      });
    }
  }

  refresh() {
    this.isLoading = true;
    UserFactory.getUser(this.user.username, this.gs.globalProperties).then((user: User) => {
      this.user = user;
      this.isLoading = false;
      this.loaded = true;
      this.userMemoryService.setUser(this.user);
      this.usernameView = this.user.username;
    });
  }

  delega() {
    StaticDelegator.delegateWithHive(this.user.username, 'cur8', this.valoreDelega.toString(), () => { console.log('fatto') }).then((result) => {
      console.log('delega effettuata');
    }).catch((error) => {
      console.log('errore nella delega');
    });

  }



}