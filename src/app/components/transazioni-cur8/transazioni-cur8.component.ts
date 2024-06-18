import { Component, OnInit } from '@angular/core';
import { GlobalPropertiesHiveService } from '../../services/global-properties-hive.service';
import { VoteTransaction } from '../../classes/biz/hive-user';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DateFormatPipe } from "../../pipes/date-format.pipe";
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { MatCardContent } from '@angular/material/card';
import { MatButtonToggleGroup, MatButtonToggle } from '@angular/material/button-toggle';
import { MatButton } from '@angular/material/button';
import { Client } from '@hiveio/dhive';

@Component({
  selector: 'app-transazioni-cur8',
  standalone: true,
  templateUrl: '../transazioni-cur8-steem/transazioni-cur8-steem.component.html',
  styleUrl: './transazioni-cur8.component.scss',
  imports: [MatProgressSpinnerModule, DateFormatPipe, NgIf, NgFor, FormsModule, MatFormFieldModule, MatIcon, MatCard, MatCardContent, MatButtonToggleGroup, MatButtonToggle, MatButton]
})
export class TransazioniCur8Component implements OnInit {


  listaTransazioni: VoteTransaction[] = [];
  isLoading = false;
  search: any;
  constructor(public gb: GlobalPropertiesHiveService) { 
    this.listaTransazioni = this.gb.transazioniCUR8;
    if (this.listaTransazioni.length === 0) {
      this.isLoading = true;
      const url = 'https://api.hive.blog';
      const client = new Client(url);
      const account = 'cur8';
      client.database.getAccounts([account]).then((data) => {
        const account = data[0];
        const accountHistory = account['transfer_history'];
        const accountHistoryLength = accountHistory.length;
        let count = 0;
        for (let i = 0; i < accountHistoryLength; i++) {
          const transaction = accountHistory[i];
          if (transaction[1].op[0] === 'transfer') {
            const op = transaction[1].op[1];
            if (op.to === 'cur8') {
              const voteTransaction : VoteTransaction = {
                voter: op.from,
                author: op.to,
                weight: op.amount,
                timestamp: op.timestamp
              };
              this.listaTransazioni.push(voteTransaction);
              count++;
            }
          }
        }   
        this.isLoading = false;
      });

    }
  }

  ngOnInit(): void {
    

  }

  goSearch() {
    this.search = this.search.toLowerCase();
    if (this.search === '') {
      this.listaTransazioni = this.gb.transazioniCUR8;
    } else {
      this.listaTransazioni = this.gb.transazioniCUR8.filter((transazione: VoteTransaction) => {
        return transazione.author.toLowerCase().includes(this.search) || transazione.voter.toLowerCase().includes(this.search);
      });
    }

  }

  resetSearch() {
    this.search = '';
    this.listaTransazioni = this.gb.transazioniCUR8;
  }

  orderByVote(arg0: string) {
    //ordina in base al voto weight
    if (arg0 === 'desc') {
      this.listaTransazioni.sort((a, b) => {
        return b.weight - a.weight;
      });
    } else {
      this.listaTransazioni.sort((a, b) => {
        return a.weight - b.weight;
      });
    }
  }
}