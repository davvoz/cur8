import { Component } from '@angular/core';
import { VoteTransaction } from '../../classes/biz/hive-user';
import { GlobalPropertiesSteemService } from '../../services/global-properties-steem.service';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatButtonToggleGroup, MatButtonToggle } from '@angular/material/button-toggle';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DateFormatPipe } from '../../pipes/date-format.pipe';

class Logger {
  static info(message: string) {
    console.log (`INFO: ${message}`);
  }
  static debug(message: string) {
    console.log (`DEBUG: ${message}`);
  }
  static error(message: string) {
    console.log (`ERROR: ${message}`);
  }
}
@Component({
  selector: 'app-transazioni-cur8-steem',
  standalone: true,
  imports: [MatProgressSpinnerModule, DateFormatPipe, NgIf, NgFor, FormsModule, MatFormFieldModule, MatIcon,  MatCard, MatCardContent, MatButtonToggleGroup, MatButtonToggle, MatButton],
  templateUrl: './transazioni-cur8-steem.component.html',
  styleUrl: './transazioni-cur8-steem.component.scss'
})
export class TransazioniCur8SteemComponent {


  listaTransazioni: VoteTransaction[] = [];
  isLoading = false;
  search: any;
  constructor(public gb: GlobalPropertiesSteemService) { }

  ngOnInit(): void {
    this.listaTransazioni =  this.gb.transazioniCUR8;
  }

  // goSearch() {
  //   this.search = this.search.toLowerCase();
  //   if (this.search === '') {
  //     this.listaTransazioni = this.gb.transazioniCUR8;
  //   } else {
  //     this.listaTransazioni = this.gb.transazioniCUR8.filter((transazione: VoteTransaction) => {
  //       return transazione.author.toLowerCase().includes(this.search) || transazione.voter.toLowerCase().includes(this.search);
  //     });
  //   } 

  // }
  goSearch() {
    try {
      Logger.info('Inizio della funzione goSearch');

      this.search = this.search.toLowerCase();
      Logger.debug(`Search string converted to lowercase: ${this.search}`);

      if (this.search === '') {
        Logger.debug('Search string is empty, using default transaction list.');
        this.listaTransazioni = this.gb.transazioniCUR8;
      } else {
        Logger.debug('Filtering transactions based on search string.');
        this.listaTransazioni = this.gb.transazioniCUR8.filter((transazione: VoteTransaction) => {
          return (
            transazione.author.toLowerCase().includes(this.search) ||
            transazione.voter.toLowerCase().includes(this.search)
          );
        });
        Logger.debug(`Filtered transactions count: ${this.listaTransazioni.length}`);
      }

      Logger.info('Funzione goSearch completata con successo');
    } catch (error: any) {
      Logger.error(`Errore nella funzione goSearch: ${error.message}`);
      // Possibile gestione aggiuntiva dell'errore (es. rilancio, notifiche, etc.)
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
