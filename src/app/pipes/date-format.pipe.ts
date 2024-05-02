import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '../classes/my_utils';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {

  transform(value: Date|string, ...args: unknown[]): unknown {
    console.log('value', value);
    const out = new Date(value);
    console.log('out', out);
    if (isNaN(out.getTime())) {
      return value+'SCARTATA';
    };
    return Utils.formatDate(out);
  }

}
