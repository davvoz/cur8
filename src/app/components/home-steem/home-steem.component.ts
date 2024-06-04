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
import { MatDivider } from '@angular/material/divider';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { Client } from 'dsteem';
import { Utils } from '../../classes/my_utils';
import { ReversePadZeroPipe } from '../../pipes/reverse-pad-zero.pipe';
import { ApiService } from '../../services/api.service';
import { GlobalPropertiesSteemService } from '../../services/global-properties-steem.service';
import { InterpretaHTMLDirective } from '../../directives/interpreta-html.directive';
import { TransazioniCur8SteemComponent } from "../transazioni-cur8-steem/transazioni-cur8-steem.component";
import { BarChartSteemComponent } from "../bar-chart-steem/bar-chart-steem.component";
import { RanzaAllinteroPipe } from "../../pipes/ranza-allintero.pipe";

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home-steem.component2.html',
    styleUrl: './home-steem.component.scss',
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
        InterpretaHTMLDirective,
        TransazioniCur8SteemComponent,
        BarChartSteemComponent,
        RanzaAllinteroPipe
    ]
})
export class HomeSteemComponent implements AfterViewInit{
    gridCols: number = 6;
    rowHeight: string = '120px';
  
    factor: number = 2;
    colspanWelcome: number = 6;
    rowspanWelcome: number = 1 * this.factor;
  
    colspanTotalSteemPower: number = 3;
    rowspanTotalSteemPower: number = 1 * this.factor;
  
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
  
    client = new Client('https://api.moecki.online');
    manaPercentageSteem: number = 0;
    isMobile = window.innerWidth < 768;
    @ViewChild('gaugeCanvasSteem')
    gaugeCanvasSteem!: ElementRef;

    totalDelegators: any;
    totalSteemPower: any;
    totalSteemRecieved = 0;
    totalSteem: number = 0
    account: any;
    allTimePayOut: any;
    days_payout: any;
    content: any;

    constructor(private gs: GlobalPropertiesSteemService, private apiService: ApiService) {
        if (this.isMobile) {
            this.gridCols = 1;
            this.colspanWelcome = 1;
            this.rowspanWelcome = 1;
            this.colspanTotalSteemPower = 1;
            this.colspanTotalDelegators = 1;
            this.colspanAllTimePayOut = 1;
            this.colspanVotingPower = 1;
            this.colspanLast7DaysPayout = 1;
            this.colspanCurationRewards = 1;
            this.colspanRecentOperations = 1;
            this.colspanCur8News = 1;
            this.colspanSocial = 1;
        }
        
        if(gs.allTimePayOut_DA_MOLTIPLICARE === 0 || gs.daysPayout_DA_MOLTIPLICARE === 0){
            this.apiService.get('https://imridd.eu.pythonanywhere.com/api/steem').then((data) => {
                //follow_count
                this.allTimePayOut = data[0]['total_rewards'] * this.gs.globalPrezzi.price;
                this.days_payout = data[0]['curation_rewards_7d'] * this.gs.globalPrezzi.price;
                this.gs.allTimePayOut_DA_MOLTIPLICARE = data[0]['total_rewards'] ;
                this.gs.daysPayout_DA_MOLTIPLICARE = data[0]['curation_rewards_7d'];
            });
        }else{
            this.allTimePayOut = this.gs.allTimePayOut_DA_MOLTIPLICARE * this.gs.globalPrezzi.price;
            this.days_payout = this.gs.daysPayout_DA_MOLTIPLICARE * this.gs.globalPrezzi.price;
        }
       
        //account
        if (!this.gs.accountCUR8) {
            this.client.database.getAccounts(['cur8']).then((data) => {
                this.account = data[0];
                this.init();
                this.gs.accountCUR8 = this.account;
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
                this.calculateManaPercentage(data[0], timestampLastVote);   
            });
        } else {
            const timestampLastVote = this.account.last_vote_time;
            this.calculateManaPercentage(this.account, timestampLastVote);
            
        }
    }

    private init() {
        this.content = this.gs.listaPost;

        this.totalDelegators = this.gs.delegatori;
        this.totalSteemPower = Utils.vestingShares2HP(
            Utils.toStringParseFloat(this.account.vesting_shares),
            this.gs.globalProperties.totalVestingFundSteem,
            this.gs.globalProperties.totalVestingShares);
        this.totalSteemRecieved = Utils.vestingShares2HP(
            Utils.toStringParseFloat(this.account.received_vesting_shares),
            this.gs.globalProperties.totalVestingFundSteem,
            this.gs.globalProperties.totalVestingShares);
        this.totalSteem = this.totalSteemPower + this.totalSteemRecieved;
    }

    private calculateManaPercentage(account: any, timestampLastVote: string) {
        const lastVoteTime = new Date(timestampLastVote);
        lastVoteTime.setHours(lastVoteTime.getHours() + 2);
        const numericLastVoteTime = lastVoteTime.getTime();
        const now = new Date().getTime();
        const diff = now - numericLastVoteTime;
        const diffSeconds = diff / 1000;
        const regeneratedVp = diffSeconds * 0.02314814814;
        const votingPower = (account.voting_power + regeneratedVp) / 100;
        this.manaPercentageSteem = Math.round(votingPower * 100) / 100;
        this.drawGauge(this.gaugeCanvasSteem, this.manaPercentageSteem);
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

    regoleRiempimentoColore = (percentuale: number) => {
        if (percentuale < 50) {
            return 'red';
        } else if (percentuale < 90) {
            return 'rgb(255, 220, 0)'
        } else {
            return 'green';
        }
    }
}