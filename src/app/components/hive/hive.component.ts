import { Component, NgZone } from '@angular/core';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { StaticLogin } from '../../classes/biz/login';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-hive',
  standalone: true,
  templateUrl: './hive.component.html',
  styleUrl: './hive.component.scss',
  imports: [
    CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule,
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

  loginForm: FormGroup;

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
    logged: false
  };

  displayedColumns = ['account', 'ammount', 'exp date'];

  delegations = [
    { ammount: 100, expDate: '2021-01-01' },
    { ammount: 200, expDate: '2021-01-01' }
  ];

  powerUpHPValue: any;
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
  logged = false;

  constructor(private userMemoryService: UserMemoryService,
    public gs: GlobalPropertiesHiveService,
    private fb: FormBuilder,
    private ngZone: NgZone) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required]
    });
    this.isMobile = window.innerWidth < 768;
    this.global_properties = this.gs.getGlobalProperties();
    this.user.global_properties = this.gs.getGlobalProperties();
    this.imridData = this.gs.getImridData();

    if (this.userMemoryService.user && this.userMemoryService.user.logged) {
      this.user = this.userMemoryService.user;
      this.usernameView = this.user.username;
      this.loaded = true;

    }
    this.isLoading = false;
  }

  init(): void {
    this.imridData = {
      delegaCur8: 0,
      ultimoPagamento: 0
    };

    this.global_properties = {
      totalVestingFundHive: 0,
      totalVestingShares: 0
    };

    this.user = {
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
      logged: false
    };

    this.displayedColumns = ['account', 'ammount', 'exp date'];

    this.delegations = [
      { ammount: 100, expDate: '2021-01-01' },
      { ammount: 200, expDate: '2021-01-01' }
    ];

    this.powerUpHPValue = null;
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

  login() {
    if ((window as any).hive_keychain) {
      this.isLoading = true;
      const keychain = (window as any).hive_keychain;
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

  refresh() {
    UserFactory.getUser(this.user.username, this.gs.getGlobalProperties()).then((user: User) => {
      this.user = user;
      this.isLoading = false;
      this.userMemoryService.setUser(this.user);
      this.usernameView = this.user.username;
      this.logged = true;
      this.loaded = true;

    });
  }

  delega() {
    StaticDelegator.delegateWithHive(this.user.username, 'cur8', this.valoreDelega.toString(), () => { console.log('delega eseguita') }).then((result) => {
      console.log('delega effettuata');
    }).catch((error) => {
      console.log('errore nella delega', error);
    });

  }
}