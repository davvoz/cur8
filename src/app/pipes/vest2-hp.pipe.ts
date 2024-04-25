import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '../classes/my_utils';

@Pipe({
  name: 'vest2HP',
  standalone: true
})
export class Vest2HPPipe implements PipeTransform {

  transform(value: number, ...args: number[]): unknown {
    return Utils.vestingShares2HP(value, args[0], args[1]);
  }

}
