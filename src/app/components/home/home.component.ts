import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatCardContent } from '@angular/material/card';
import { MatCardTitle } from '@angular/material/card';
import { MatCardSubtitle } from '@angular/material/card';
import { MatCardActions } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCardImage, MatCardHeader } from '@angular/material/card';
import { MatGridTile, MatGridList, MatGridAvatarCssMatStyler, MatGridTileFooterCssMatStyler } from '@angular/material/grid-list';
import { NgFor, NgIf } from '@angular/common';
import { Client } from '@hiveio/dhive';
import { MatDivider } from '@angular/material/divider';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { Utils } from '../../classes/my_utils';
import { ReversePadZeroPipe } from '../../pipes/reverse-pad-zero.pipe';
import { GlobalPropertiesHiveService } from '../../services/global-properties-hive.service';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { TransazioniCur8Component } from '../transazioni-cur8/transazioni-cur8.component';
import { ApiService } from '../../services/api.service';
import { InterpretaHTMLDirective } from '../../directives/interpreta-html.directive';
import { TransazioniCur8SteemComponent } from "../transazioni-cur8-steem/transazioni-cur8-steem.component";
import { RanzaAllinteroPipe } from '../../pipes/ranza-allintero.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component2.html',
  styleUrl: './home.component.scss',
  imports: [
    MatProgressSpinnerModule,
    NgIf,
    MatToolbar,
    MatToolbarRow,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatGridTile,
    MatGridList,
    MatGridAvatarCssMatStyler,
    MatGridTileFooterCssMatStyler,
    MatDivider,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatCardSubtitle,
    MatCardActions,
    MatButton,
    MatIcon,
    MatCardImage,
    NgFor,
    ReversePadZeroPipe,
    BarChartComponent,
    TransazioniCur8Component,
    InterpretaHTMLDirective,
    TransazioniCur8SteemComponent,
    RanzaAllinteroPipe
  ]
})

export class HomeComponent implements AfterViewInit {
  gridCols: number = 6;
  rowHeight: string = '120px';

  factor: number = 2;
  colspanWelcome: number = 6;
  rowspanWelcome: number = 1 * this.factor;

  colspanTotalHivePower: number = 3;
  rowspanTotalHivePower: number = 1 * this.factor;

  colspanTotalDelegators: number = 3;
  rowspanTotalDelegators: number = 1 * this.factor;

  colspanAllTimePayOut: number = 2;
  rowspanAllTimePayOut: number = 1 * this.factor;

  colspanVotingPower: number = 2;
  rowspanVotingPower: number = 1 * this.factor;

  colspanLast7DaysPayout: number = 2;
  rowspanLast7DaysPayout: number = 1 * this.factor;

  colspanCurationRewards: number = 3;
  rowspanCurationRewards: number = 2;

  colspanRecentOperations: number = 3;
  rowspanRecentOperations: number = 3;

  colspanCur8News: number = 3;
  rowspanCur8News: number = 4;

  colspanSocial: number = 3;
  rowspanSocial: number = 2;

  client = new Client('https://api.hive.blog');
  @ViewChild('gaugeCanvasHive')
  gaugeCanvasHive!: ElementRef;

  totalDelegators: any;
  totalHivePower: any;
  totalHiveRecieved = 0;
  account: any;
  totalHive: number = 0;
  isMobile = false;
  manaPercentageHive: number = 0;
  allTimePayOut: any;
  days_payout: any;
  content: any;
  isLoading = true;


  constructor(private gs: GlobalPropertiesHiveService, private apiService: ApiService) {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.gridCols = 1;
      this.colspanWelcome = 1;
      this.colspanTotalHivePower = 1;
      this.colspanTotalDelegators = 1;
      this.colspanAllTimePayOut = 1;
      this.colspanVotingPower = 1;
      this.colspanLast7DaysPayout = 1;
      this.colspanCurationRewards = 1;
      this.colspanRecentOperations = 1;
      this.colspanCur8News = 1;
      this.colspanSocial = 1;
    }

    if (!this.gs.getAccountCUR8()) {
      this.client.database.getAccounts(['cur8']).then((data) => {
        this.account = data[0];
        this.init();
      });
    } else {
      this.account = this.gs.getAccountCUR8();
      this.init();
    }
  }

  ngAfterViewInit(): void {
    if (!this.gs.getAccountCUR8()) {
      this.client.database.getAccounts(['cur8']).then((data) => {
        const timestampLastVote = data[0].last_vote_time;
        this.calculateManaPercentage(data[0], timestampLastVote);
      });
    } else {
      const timestampLastVote = this.account.last_vote_time;
      this.calculateManaPercentage(this.account, timestampLastVote);
    }
  }

  private init() {
    this.content = this.gs.getListaPost();

    this.totalDelegators = this.gs.getDelegatori();

    this.totalHivePower = Utils.vestingShares2HP(
      Utils.toStringParseFloat(this.account.vesting_shares),
      this.gs.getGlobalProperties().totalVestingFundHive,
      this.gs.getGlobalProperties().totalVestingShares);

    this.totalHiveRecieved = Utils.vestingShares2HP(
      Utils.toStringParseFloat(this.account.received_vesting_shares),
      this.gs.getGlobalProperties().totalVestingFundHive,
      this.gs.getGlobalProperties().totalVestingShares);
   
      this.totalHive = this.totalHivePower + this.totalHiveRecieved;

    if (this.gs.getAllTimePayOut_DA_MOLTIPLICARE() === 0 || this.gs.getDaysPayout_DA_MOLTIPLICARE() === 0) {
      this.apiService.get('https://imridd.eu.pythonanywhere.com/api/hive').then((data) => {
        this.allTimePayOut = data[0]['total_rewards'] * this.gs.getGlobalPrezzi().price;
        this.days_payout = data[0]['curation_rewards_7d'] * this.gs.getGlobalPrezzi().price;
        this.gs.setAllTimePayOut_DA_MOLTIPLICARE( data[0]['total_rewards']);
        this.gs.setDaysPayout_DA_MOLTIPLICARE(data[0]['curation_rewards_7d']);
      });
    } else {
      this.allTimePayOut = this.gs.getAllTimePayOut_DA_MOLTIPLICARE() * this.gs.getGlobalPrezzi().price;
      this.days_payout = this.gs.getDaysPayout_DA_MOLTIPLICARE() * this.gs.getGlobalPrezzi().price;
    }


    if (!this.gs.getDelegatori()) {
      this.apiService.get('https://ecency.com/private-api/received-vesting/cur8').then((data) => {
        this.gs.setDelegatori( data['list'].length);
        this.totalDelegators = this.gs.getDelegatori();
      }).finally(() => {
        this.isLoading = false;
      });
    } else {
      
      this.isLoading = false;
      this.totalDelegators = this.gs.getDelegatori();
    }
  }

  private calculateManaPercentage(accountData: any, timestampLastVote: string) {
    const lastVoteTime = new Date(timestampLastVote);
    lastVoteTime.setHours(lastVoteTime.getHours() + 2);
    const numericLastVoteTime = lastVoteTime.getTime();
    const now = new Date().getTime();
    const diff = now - numericLastVoteTime;
    const diffSeconds = diff / 1000;
    const regeneratedVp = diffSeconds * 0.02314814814;
    const votingPower = (accountData.voting_power + regeneratedVp) / 100;
    this.manaPercentageHive = Math.round(votingPower * 100) / 100;
    this.drawGauge(this.gaugeCanvasHive, this.manaPercentageHive);
  }

  drawGauge(element: ElementRef, manaPercentage: number): void {
    const canvas = element.nativeElement;
    const ctx = canvas.getContext('2d');
    const maxDimension = Math.min(canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = maxDimension / 2 - 10;
    const startAngle = 1.5 * Math.PI;
    const endAngle = 1.5 * Math.PI + 2 * Math.PI * manaPercentage / 100;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.lineWidth = 10;
    ctx.strokeStyle = this.regoleRiempimentoColore(manaPercentage);
    ctx.stroke();
    //usa un testo grande affusolato
    ctx.font = 'lighter 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';

    ctx.fillText(manaPercentage + '%', centerX, centerY + 10);


  }

  regoleRiempimentoColore = (percentuale: number): string => {
    if (percentuale < 50) {
      return 'red';
    } else if (percentuale < 90) {
      return 'rgb(255, 220, 0)';
    } else {
      return 'green';
    }
  }


}
