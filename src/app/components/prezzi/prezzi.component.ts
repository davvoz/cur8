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

    if(this.gsHIVE.getGlobalPrezzi().price == 0) {
      this.gsHIVE.setPrices().then(() => {
        this.hivePrice = this.gsHIVE.getGlobalPrezzi().price;
        this.hivePriceDollaro = this.gsHIVE.getGlobalPrezzi().price_dollar;
      });
    } else {
      this.hivePrice = this.gsHIVE.getGlobalPrezzi().price;
      this.hivePriceDollaro = this.gsHIVE.getGlobalPrezzi().price_dollar;
    }
    
    if(this.gsSTEEM.getGlobalPrezzi().price === 0) {
      this.gsSTEEM.setPrices().then(() => {
        this.steemPrice = this.gsSTEEM.getGlobalPrezzi().price;
        this.steemPriceDollaro = this.gsSTEEM.getGlobalPrezzi().price_dollar;
      });
    } else {
      this.steemPrice = this.gsSTEEM.getGlobalPrezzi().price;
      this.steemPriceDollaro = this.gsSTEEM.getGlobalPrezzi().price_dollar;
    }

  }
}
