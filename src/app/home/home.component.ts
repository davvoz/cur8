import { Component, ElementRef, ViewChild } from '@angular/core';
//matcard
import { MatCard } from '@angular/material/card';
import { MatCardContent } from '@angular/material/card';
import { MatCardTitle } from '@angular/material/card';
import { MatCardSubtitle } from '@angular/material/card';
import { MatCardActions } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCardImage, MatCardHeader } from '@angular/material/card';
import { MatGridTile, MatGridList, MatGridAvatarCssMatStyler, MatGridTileFooterCssMatStyler, MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';

import { NgFor } from '@angular/common';
import { Client } from '@hiveio/dhive';
//mat-divider
import { MatDivider } from '@angular/material/divider';
//mat-toolbar , row
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { ExtendedAccount } from 'dsteem';
import { Utils } from '../classes/my_utils';
import { GlobalPropertiesService } from '../services/global-properties.service';
import { ReversePadZeroPipe } from "../pipes/reverse-pad-zero.pipe";
import { ApiService } from '../services/api.service';
//ngIf
import { NgIf } from '@angular/common';
@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
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
        MatCard, MatCardContent, MatCardTitle, MatCardSubtitle, MatCardActions, MatButton, MatIcon, MatCardImage, NgFor,
        ReversePadZeroPipe
    ]
})
export class HomeComponent {

    client = new Client('https://api.hive.blog');

    manaPercentageHive: number = 0;

    @ViewChild('gaugeCanvasHive')
    gaugeCanvasHive!: ElementRef;

    regoleRiempimentoColore = (percentuale: number) => {
        if (percentuale < 50) {
            return 'red';
        } else if (percentuale < 90) {
            return 'rgb(255, 220, 0)'
        } else {
            return 'green';
        }
    }

    totalDelegators: any;
    totalHivePower: any;
    totalHiveRecieved = 0;
    account: any;
    allTimePayOut: any;
    totalHive: number = 0;
    isMobile = false;

    constructor(private gs: GlobalPropertiesService) {
        this.isMobile = window.innerWidth < 768;

        if (!this.gs.accountCUR8) {
            this.client.database.getAccounts(['cur8']).then((data) => {
                this.account = data[0];
                console.log('account', this.account);
                this.init();
            });
        } else {
            console.log('account', this.gs.accountCUR8);
            this.account = this.gs.accountCUR8;
            this.init();
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
    ngAfterViewInit(): void {
        if (!this.gs.accountCUR8) {
            this.client.database.getAccounts(['cur8']).then((data) => {
                const timestampLastVote = data[0].last_vote_time;
                const lastVoteTime = new Date(timestampLastVote);
                lastVoteTime.setHours(lastVoteTime.getHours() + 2);
                const numericLastVoteTime = lastVoteTime.getTime();
                const now = new Date().getTime();
                const diff = now - numericLastVoteTime;
                const diffSeconds = diff / 1000;
                const regeneratedVp = diffSeconds * 0.02314814814;
                const votingPower = (data[0].voting_power + regeneratedVp) / 100;
                this.manaPercentageHive = votingPower;
                this.manaPercentageHive = Math.round(this.manaPercentageHive * 100) / 100;
                this.drawGauge(this.gaugeCanvasHive, this.manaPercentageHive);
            });
        } else {
            const timestampLastVote = this.account.last_vote_time;
            const lastVoteTime = new Date(timestampLastVote);
            lastVoteTime.setHours(lastVoteTime.getHours() + 2);
            const numericLastVoteTime = lastVoteTime.getTime();
            const now = new Date().getTime();
            const diff = now - numericLastVoteTime;
            const diffSeconds = diff / 1000;
            const regeneratedVp = diffSeconds * 0.02314814814;
            const votingPower = (this.account.voting_power + regeneratedVp) / 100;
            this.manaPercentageHive = votingPower;
            this.manaPercentageHive = Math.round(this.manaPercentageHive * 100) / 100;
            this.drawGauge(this.gaugeCanvasHive, this.manaPercentageHive);

        }

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



}
