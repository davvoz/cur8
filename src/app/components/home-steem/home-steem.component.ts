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
    styleUrl: '../home/home.component.scss',
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
export class HomeSteemComponent implements AfterViewInit {
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
    @ViewChild('gaugeCanvasSteem')
    gaugeCanvasSteem!: ElementRef;

    totalDelegators: any;
    totalSteemPower: any;
    totalSteemRecieved = 0;
    totalSteem: number = 0
    isMobile: boolean = false;
    account: any;
    manaPercentageSteem: number = 0;
    allTimePayOut: any;
    days_payout: any;
    content: any;

    constructor(private gs: GlobalPropertiesSteemService, private apiService: ApiService) {
        this.isMobile = window.innerWidth < 768;
        if (this.isMobile) {
            this.gridCols = 1;
            this.colspanWelcome = 1;
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


        //account
        if (!this.gs.getAccountCUR8()) {
            this.client.database.getAccounts(['cur8']).then((data) => {
                this.account = data[0];
                //
            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                this.gs.setAccountCUR8(this.account);
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

        this.totalSteemPower = Utils.vestingShares2HP(
            Utils.toStringParseFloat(this.account.vesting_shares),
            this.gs.getGlobalProperties().totalVestingFundSteem,
            this.gs.getGlobalProperties().totalVestingShares);

        this.totalSteemRecieved = Utils.vestingShares2HP(
            Utils.toStringParseFloat(this.account.received_vesting_shares),
            this.gs.getGlobalProperties().totalVestingFundSteem,
            this.gs.getGlobalProperties().totalVestingShares);


        this.totalSteem = this.totalSteemPower + this.totalSteemRecieved;

        console.log('totalSteem', this.totalSteem);

        if (this.gs.getAllTimePayOut_DA_MOLTIPLICARE() === 0
            || this.gs.getDaysPayout_DA_MOLTIPLICARE() === 0
            || this.gs.getGlobalPrezzi().price === 0
            || this.gs.getGlobalPrezzi().price_dollar === 0
            || typeof this.gs.getGlobalPrezzi().price === 'undefined'
            || typeof this.gs.getGlobalPrezzi().price_dollar === 'undefined'
            || typeof this.gs.getAllTimePayOut_DA_MOLTIPLICARE() === 'undefined'
            || typeof this.gs.getDaysPayout_DA_MOLTIPLICARE() === 'undefined'
        ) {
            console.log('fetching steem data', this.gs.getAllTimePayOut_DA_MOLTIPLICARE(), this.gs.getDaysPayout_DA_MOLTIPLICARE());
            this.apiService.get('https://imridd.eu.pythonanywhere.com/api/steem').then((data) => {
                //follow_count
                this.allTimePayOut = data[0]['total_rewards'] * this.gs.getGlobalPrezzi().price;
                this.days_payout = data[0]['curation_rewards_7d'] * this.gs.getGlobalPrezzi().price;
                this.gs.setAllTimePayOut_DA_MOLTIPLICARE(data[0]['total_rewards']);
                this.gs.setDaysPayout_DA_MOLTIPLICARE(data[0]['curation_rewards_7d']);
                console.log('allTimePayOut', this.allTimePayOut);
                console.log('days_payout', this.days_payout);
                console.log('total_rewards', data[0]['total_rewards']);
                console.log('curation_rewards_7d', data[0]['curation_rewards_7d']);
                console.log('price', this.gs.getGlobalPrezzi().price);
                console.log('price_dollar', this.gs.getGlobalPrezzi().price_dollar);
                console.log('all data', data);
                if (this.gs.getGlobalPrezzi().price === 0 || this.gs.getGlobalPrezzi().price_dollar === 0) {
                    console.log('fetching steem chart data', this.gs.getAllTimePayOut_DA_MOLTIPLICARE(), this.gs.getDaysPayout_DA_MOLTIPLICARE());
                    this.apiService.get('https://imridd.eu.pythonanywhere.com/api/prices').then((data) => {
                        this.gs.setGlobalPrezzi({
                            price: data['STEEM'],
                            price_dollar: data['SBD']
                        });
                        console.log('price', this.gs.getGlobalPrezzi().price);
                        console.log('price_dollar', this.gs.getGlobalPrezzi().price_dollar);
                    });
                }
            });
        } else {
            console.log('using steem data from global properties', this.gs.getAllTimePayOut_DA_MOLTIPLICARE(), this.gs.getDaysPayout_DA_MOLTIPLICARE());
            this.allTimePayOut = this.gs.getAllTimePayOut_DA_MOLTIPLICARE() * this.gs.getGlobalPrezzi().price;
            this.days_payout = this.gs.getDaysPayout_DA_MOLTIPLICARE() * this.gs.getGlobalPrezzi().price;

        }

        console.log('allTimePayOut', this.allTimePayOut);
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
        ctx.lineWidth = 10;
        ctx.strokeStyle = this.regoleRiempimentoColore(manaPercentage);
        ctx.stroke();
        //usa un testo grande affusolato
        ctx.font = 'lighter 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';

        ctx.fillText(manaPercentage + '%', centerX, centerY + 10);
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