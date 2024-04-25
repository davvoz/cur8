import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, ...args: any[]): string {
    //ritorna la stringa troncata
    let limit = args[0];
    let trail = args[1];
    return value.length > limit ? value.substring(0, limit) + trail : value;

  }
  //usage: {{ 'This is a long string' | truncate:10:'...' }}

}
