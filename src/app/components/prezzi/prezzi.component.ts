import { Component, Input } from '@angular/core';
import { GlobalPropertiesHiveService } from '../../services/global-properties-hive.service';
import { GlobalPropertiesSteemService } from '../../services/global-properties-steem.service';
import { ReversePadZeroPipe } from "../../pipes/reverse-pad-zero.pipe";

@Component({
    selector: 'app-prezzi',
    standalone: true,
    templateUrl: './prezzi.component.html',
    styleUrl: './prezzi.component.scss',
    imports: [ReversePadZeroPipe]
})
export class PrezziComponent {
  hivePrice: number = 0;
  steemPrice: number = 0;
  hivePriceDollaro: number = 0;
  steemPriceDollaro: number = 0;
  @Input() platform: string = 'HIVE';
  constructor(public gsHIVE: GlobalPropertiesHiveService, public gsSTEEM: GlobalPropertiesSteemService) {

    if(this.gsHIVE.globalPrezzi.price == 0) {
      this.gsHIVE.setPrices().then(() => {
        this.hivePrice = this.gsHIVE.globalPrezzi.price;
        this.hivePriceDollaro = this.gsHIVE.globalPrezzi.price_dollar;
      });
    } else {
      this.hivePrice = this.gsHIVE.globalPrezzi.price;
      this.hivePriceDollaro = this.gsHIVE.globalPrezzi.price_dollar;
    }
    
    if(this.gsSTEEM.globalPrezzi.price === 0) {
      this.gsSTEEM.setPrices().then(() => {
        this.steemPrice = this.gsSTEEM.globalPrezzi.price;
        this.steemPriceDollaro = this.gsSTEEM.globalPrezzi.price_dollar;
      });
    } else {
      this.steemPrice = this.gsSTEEM.globalPrezzi.price;
      this.steemPriceDollaro = this.gsSTEEM.globalPrezzi.price_dollar;
    }

  }
}
