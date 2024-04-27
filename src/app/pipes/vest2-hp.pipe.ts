import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '../classes/my_utils';

@Pipe({
  name: 'vest2HP',
  standalone: true
})
export class Vest2HPPipe implements PipeTransform {

  transform(value: number, ...args: number[]): unknown {
    const vest =parseFloat( args[0].toString());
    const shares = parseFloat(args[1].toString())
    console.log('vest2HP', value, vest, shares);
    return Utils.vestingShares2HP(value, vest, shares);
  }

}
