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
import { MatButtonToggleGroup , MatButtonToggle} from '@angular/material/button-toggle';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-transazioni-cur8',
  standalone: true,
  templateUrl: './transazioni-cur8.component.html',
  styleUrl: './transazioni-cur8.component.scss',
  imports: [MatProgressSpinnerModule, DateFormatPipe, NgIf, NgFor, FormsModule, MatFormFieldModule, MatIcon,  MatCard, MatCardContent, MatButtonToggleGroup, MatButtonToggle, MatButton]
})
export class TransazioniCur8Component implements OnInit {


listaTransazioni: VoteTransaction[] = [];
  isLoading = true;
  search: any;
  constructor(public gb: GlobalPropertiesHiveService) { }

  ngOnInit(): void {
    if (this.gb.transazioniCUR8.length > 0) {
      this.listaTransazioni = this.gb.transazioniCUR8;
      this.isLoading = false;
    } else {
      this.gb.setTransazioniCur8().then(() => {
        this.gb.transazioniCUR8.reverse().forEach((transazione: VoteTransaction) => {
          this.listaTransazioni.push(transazione);
        });
        this.isLoading = false;
      });
    }
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