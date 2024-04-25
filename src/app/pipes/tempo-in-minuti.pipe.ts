import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tempoInMinuti',
  standalone: true
})
export class TempoInMinutiPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    //ci danno i secondi , trasformiamoli in anni se serve , in mesi se serve , in giorni se serve , in ore se serve , in minuti se serve
    let secondi = value as number;
    let minuti = secondi / 60;
    return minuti;
    
    
  }

}
