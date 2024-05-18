import { Component, Input } from '@angular/core';
import { GlobalPropertiesHiveService } from '../../services/global-properties-hive.service';
import { GlobalPropertiesSteemService } from '../../services/global-properties-steem.service';

@Component({
  selector: 'app-prezzi',
  standalone: true,
  imports: [],
  templateUrl: './prezzi.component.html',
  styleUrl: './prezzi.component.scss'
})
export class PrezziComponent {
  hivePrice: number = 0;
  steemPrice: number = 0;
  hivePriceDollaro: number = 0;
  steemPriceDollaro: number = 0;
  @Input() platform: string = 'HIVE';
  constructor(public gsHIVE: GlobalPropertiesHiveService, public gsSTEEM: GlobalPropertiesSteemService) {

    if(this.gsHIVE.global_prezzi.price == 0) {
      this.gsHIVE.setPrices().then(() => {
        this.hivePrice = this.gsHIVE.global_prezzi.price;
        this.hivePriceDollaro = this.gsHIVE.global_prezzi.price_dollar;
      });
    } else {
      this.hivePrice = this.gsHIVE.global_prezzi.price;
      this.hivePriceDollaro = this.gsHIVE.global_prezzi.price_dollar;
    }
    
    if(this.gsSTEEM.global_prezzi.price === 0) {
      this.gsSTEEM.setPrices().then(() => {
        this.steemPrice = this.gsSTEEM.global_prezzi.price;
        this.steemPriceDollaro = this.gsSTEEM.global_prezzi.price_dollar;
      });
    } else {
      this.steemPrice = this.gsSTEEM.global_prezzi.price;
      this.steemPriceDollaro = this.gsSTEEM.global_prezzi.price_dollar;
    }

  }
}
