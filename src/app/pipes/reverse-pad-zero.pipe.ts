import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reversePadZero',
  standalone: true
})
export class ReversePadZeroPipe implements PipeTransform {

  transform(value: number): string {
    if (isNaN(value) || value === null) return '';

    // Converte il numero in stringa mantenendo solo 3 decimali
    let stringValue = value.toFixed(3);

    // Rimuove gli zeri non significativi
    while (stringValue.includes('.') && (stringValue.endsWith('0') || stringValue.endsWith('.'))) {
      stringValue = stringValue.slice(0, -1);
    }

    return stringValue;
  }
}

