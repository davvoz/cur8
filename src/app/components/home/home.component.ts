import { Component, ElementRef, ViewChild } from '@angular/core';
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

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component2.html',
    styleUrl: './home.component.scss',
    imports: [
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
        TransazioniCur8Component
    ]
})

export class HomeComponent {
    gridCols: number = 6;
    rowHeight: string = '200px';
  
    colspanWelcome: number = 6;
    rowspanWelcome: number = 1;
  
    colspanTotalHivePower: number = 3;
    rowspanTotalHivePower: number = 1;
  
    colspanTotalDelegators: number = 3;
    rowspanTotalDelegators: number = 1;
  
    colspanAllTimePayOut: number = 2;
    rowspanAllTimePayOut: number = 1;
  
    colspanVotingPower: number = 2;
    rowspanVotingPower: number = 1;

    colspanLast7DaysPayout: number = 2;
    rowspanLast7DaysPayout: number = 1;

    colspanCurationRewards: number = 3; 
    rowspanCurationRewards: number = 2;

    colspanRecentOperations: number = 3;
    rowspanRecentOperations: number = 2;

    colspanCur8News: number = 3;
    rowspanCur8News: number = 2;

    colspanSocial: number = 3;
    rowspanSocial: number = 2;

    client = new Client('https://api.hive.blog');


    @ViewChild('gaugeCanvasHive')
    gaugeCanvasHive!: ElementRef;

    totalDelegators: any;
    totalHivePower: any;
    totalHiveRecieved = 0;
    account: any;
    allTimePayOut: any;
    totalHive: number = 0;
    isMobile = false;
    manaPercentageHive: number = 0;


    constructor(private gs: GlobalPropertiesHiveService) {
        this.isMobile = window.innerWidth < 768;
        //se mobile imposto il numero di colonne a 1 
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
        if (!this.gs.accountCUR8) {
          this.client.database.getAccounts(['cur8']).then((data) => {
            this.account = data[0];
            this.init();
          });
        } else {
          this.account = this.gs.accountCUR8;
          this.init();
        }
      }
    
      ngAfterViewInit(): void {
        if (!this.gs.accountCUR8) {
          this.client.database.getAccounts(['cur8']).then((data) => {
            const timestampLastVote = data[0].last_vote_time;
            this.calculateManaPercentageHive(data[0], timestampLastVote);
          });
        } else {
          const timestampLastVote = this.account.last_vote_time;
          this.calculateManaPercentageHive(this.account, timestampLastVote);
        }
      }
    
      private init() {
        this.totalDelegators = this.gs.delegatori;
        this.allTimePayOut = Utils.toStringParseFloat(this.account.to_withdraw);
        this.totalHivePower = Utils.vestingShares2HP(
          Utils.toStringParseFloat(this.account.vesting_shares),
          this.gs.global_properties.totalVestingFundHive,
          this.gs.global_properties.totalVestingShares);
        this.totalHiveRecieved = Utils.vestingShares2HP(
          Utils.toStringParseFloat(this.account.received_vesting_shares),
          this.gs.global_properties.totalVestingFundHive,
          this.gs.global_properties.totalVestingShares);
        this.totalHive = this.totalHivePower + this.totalHiveRecieved;
      }
    
      private calculateManaPercentageHive(accountData: any, timestampLastVote: string) {
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
        //pulisci 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.lineWidth = 20;
        ctx.strokeStyle = this.regoleRiempimentoColore(manaPercentage);
        ctx.stroke();
        //dimesione del testo dinamico
        ctx.font = `${canvas.width / 3}px Impact`;
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${manaPercentage}%`, centerX, centerY);
        //stroke text
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.strokeText(`${manaPercentage}%`, centerX, centerY);
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
