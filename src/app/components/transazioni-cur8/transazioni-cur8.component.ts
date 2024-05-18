import {  Component, OnInit } from '@angular/core';
import { GlobalPropertiesHiveService } from '../../services/global-properties-hive.service';
import { VoteTransaction } from '../../classes/biz/hive-user';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DateFormatPipe } from "../../pipes/date-format.pipe";


@Component({
  selector: 'app-transazioni-cur8',
  standalone: true,
  templateUrl: './transazioni-cur8.component.html',
  styleUrl: './transazioni-cur8.component.scss',
  imports: [MatProgressSpinnerModule, DateFormatPipe]
})
export class TransazioniCur8Component implements OnInit  {
  listaTransazioni: VoteTransaction[] = [];
  isLoading = true;
  constructor(public gb: GlobalPropertiesHiveService) {}

  ngOnInit(): void {
    if (this.gb.transazioniCUR8.length > 0) {
      this.listaTransazioni = this.gb.transazioniCUR8;
      this.isLoading = false;
    } else {
      this.gb.setTransazioniCur8().then(() => {
        this.gb.transazioniCUR8.reverse().forEach((transazione: VoteTransaction) => {
            this.listaTransazioni.push(transazione);
        } );
        this.isLoading = false;
      } );
    }
  }

}         
