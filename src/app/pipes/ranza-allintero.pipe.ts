import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ranzaAllintero',
  standalone: true
})
export class RanzaAllinteroPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
   
    //approssima all'intero
    return Math.round(Number(value));

  }

}
