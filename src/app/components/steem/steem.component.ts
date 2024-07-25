import { Component, NgZone, OnInit } from '@angular/core';
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
import { DateFormatPipe } from "../../pipes/date-format.pipe";
import { TruncatePipe } from "../../pipes/truncate.pipe";
import { Vest2HPPipe } from "../../pipes/vest2-hp.pipe";
import { ColoreRankDirective } from '../../directives/colore-rank.directive';
import { MatTableModule } from '@angular/material/table';
import { StaticDelegator } from '../../classes/biz/delegator';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReversePadZeroPipe } from "../../pipes/reverse-pad-zero.pipe";
import { IMRiddData } from '../../interfaces/interfaces';
import { User, UserFactory } from '../../classes/biz/steem-user';
import { GlobalPropertiesSteemService } from '../../services/global-properties-steem.service';
import { UserMemorySteemService } from '../../services/user-memory-steem.service';
import { Utils } from '../../classes/my_utils';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-steem',
  standalone: true,
  templateUrl: './steem.component.html',
  styleUrl: '../hive/hive.component.scss',
  imports: [
    CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule,
    MatTooltipModule,
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
  loginForm: FormGroup;
  imridData: IMRiddData = {
    delegaCur8: 0,
    ultimoPagamento: 0
  }

  global_properties: any;
  user: User = {
    totalExpiringDelegations: 0,
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
    logged: false
  };

  displayedColumns = ['account', 'ammount', 'exp date'];

  delegations = [
    { ammount: 100, expDate: '2021-01-01' },
    { ammount: 200, expDate: '2021-01-01' }
  ];

  powerUpSPValue: any;
  sendTo: any;
  sendAmount: any;
  estimatedDailyProfit: number = 0;
  search: any;
  isLoading = true;
  loaded = false;
  imridAccoount: any;
  valoreDelega = 0;
  isMobile = false;
  defaultImage = '/assets/default_user.jpg';
  usernameView: any;
  logged: boolean = false;


  constructor(public gs: GlobalPropertiesSteemService,
    private userMemoryService: UserMemorySteemService,
    private fb: FormBuilder,
    private ngZone: NgZone // Aggiungi NgZone per gestire gli aggiornamenti fuori dalla zona Angular
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required]
    });

    this.isMobile = window.innerWidth < 768;
    this.global_properties = this.gs.getGlobalProperties();
    this.user.global_properties = this.global_properties;
    this.imridData = this.gs.getImridData();

    if (this.userMemoryService.user && this.userMemoryService.user.logged) {
      this.user = this.userMemoryService.user;
      this.usernameView = this.user.username;
      this.loaded = true;
    }
    this.isLoading = false;
  }



  login() {
    if ((window as any).steem_keychain) {
      this.isLoading = true;
      const keychain = (window as any).steem_keychain;
      const username = this.loginForm.get('username')?.value;
      keychain.requestHandshake(() => {
        keychain.requestSignBuffer(username, 'Welcome to CUR8', 'Active', (response: any) => {
          this.ngZone.run(() => {
            if (response.success) {
              this.user.username = username;
              this.user.logged = true;
              this.userMemoryService.setUser(this.user);
              this.usernameView = this.user.username;
              this.logged = true;
              this.refresh();
            } else {
              console.error('Login fallito:', response);
              this.isLoading = false;
            }
          });
        });
      });
    }
  }

  logout() {
    this.init();
  }

  init(): void {
    this.imridData = {
      delegaCur8: 0,
      ultimoPagamento: 0
    };

    this.global_properties = {
      totalVestingFundSteem: 0,
      totalVestingShares: 0,
    };

    this.user = {
      totalExpiringDelegations: 0,
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
      logged: false
    };

    this.displayedColumns = ['account', 'ammount', 'exp date'];

    this.delegations = [
      { ammount: 100, expDate: '2021-01-01' },
      { ammount: 200, expDate: '2021-01-01' }
    ];

    this.powerUpSPValue = null;
    this.sendTo = null;
    this.sendAmount = null;
    this.search = null;
    this.imridAccoount = null;
    this.usernameView = null;

    this.isLoading = false;
    this.loaded = false;
    this.logged = false;

    this.valoreDelega = 0;
    this.estimatedDailyProfit = 0;

    this.isMobile = window.innerWidth < 768;
    this.defaultImage = '/assets/default_user.jpg';

    this.userMemoryService.setUser(this.user);
  }

  sendSbd() {
    if ((window as any).steem_keychain) {
      const keychain = (window as any).steem_keychain;
      if (typeof this.sendAmount == 'string') {
        this.sendAmount = parseFloat(this.sendAmount);
      }
      keychain.requestTransfer(this.user.username, this.sendTo, this.sendAmount, '', 'SBD', (response: any) => {
        console.log(response);
      });
    }
  }

  sendSteem() {
    if ((window as any).steem_keychain) {
      const keychain = (window as any).steem_keychain;
      if (typeof this.sendAmount == 'string') {
        this.sendAmount = parseFloat(this.sendAmount);
      }
      this.sendAmount = this.sendAmount.toFixed(3);
      keychain.requestTransfer(this.user.username, this.sendTo, this.sendAmount, '', 'STEEM', (response: any) => {
        console.log(response);
      });
    }
  }

  changeDailyProfit() {
    const apr = this.imridData.ultimoPagamento * 365 * 100 / this.imridData.delegaCur8;
    this.estimatedDailyProfit = this.valoreDelega * apr / 365 / 100;
  }

  powerDownSP() {
    if ((window as any).steem_keychain) {
      const keychain = (window as any).steem_keychain;
      if (typeof this.powerUpSPValue !== undefined && typeof this.powerUpSPValue == 'string') {
        this.powerUpSPValue = parseFloat(this.powerUpSPValue);
      }
      this.powerUpSPValue = Utils.toStringParseFloat(this.powerUpSPValue);
      this.powerUpSPValue = this.powerUpSPValue.toFixed(3);
      keychain.requestPowerDown(this.user.username, this.powerUpSPValue, (response: any) => {
        console.log(response);
      });
    }
  }

  powerUpSP() {
    if ((window as any).steem_keychain) {
      const keychain = (window as any).steem_keychain;
      this.powerUpSPValue = Utils.toStringParseFloat(this.powerUpSPValue);
      this.powerUpSPValue = this.powerUpSPValue.toFixed(3);
      keychain.requestPowerUp(this.user.username, this.user.username, this.powerUpSPValue, (response: any) => {
        console.log(response);
      });
    }
  }

  refresh() {
    //this.isLoading = true;
    UserFactory.getUser(this.user.username, this.gs.getGlobalProperties()).then((user: User) => {
      this.user = user;
      this.isLoading = false;
      this.loaded = true;
      this.userMemoryService.setUser(this.user)
      this.usernameView = this.user.username;
      this.logged = true;
      
    });
  }

  delega() {
    StaticDelegator.delegateWithSteem(this.user.username, 'cur8', this.valoreDelega.toString(), () => { console.log('delega eseguita') }).then((result) => {
      console.log('delega effettuata');
    }).catch((error) => {
      console.log('errore nella delega', error);
    });
  }
}
