import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '../classes/my_utils';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {

  transform(value: Date|string, ...args: unknown[]): unknown {
    const out = new Date(value);
    if (isNaN(out.getTime())) {
      return value;
    };
    return Utils.formatDate(out);
  }

}
