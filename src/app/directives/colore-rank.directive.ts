import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appColoreRank]',
  standalone: true
})
export class ColoreRankDirective {
  //in base al valore del ricevuto in input, colora il testo e il background 
  //vengono passati 2 valori: il valore da colorare e il valore massimo
  //dobbiamo calcolare il colore in base al valore e al massimo in percentuale
  //se il valore è 0, il colore è verde
  //se il valore è il massimo, il colore è rosso
  //altrimenti, il colore è un gradiente tra verde e rosso
  //il valore massimo è il valore massimo che può assumere il valore
  //il valore è il valore da colorare
  @Input('colorByValue')
  value!: any;
  @Input()
  maxValue!: number;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnChanges() {
    this.updateColor();
  }

  private updateColor() {
    if (this.value === undefined) {
      return;
    }
    if (typeof this.value === 'string') {
      this.value = parseFloat(this.value);
    }
    //crea un gradiente di colori tra verde e rosso in base al valore e al massimo
    const color = this.getColor(this.value, this.maxValue);
    this.setColor(color);


  }
  getColor(value: any, maxValue: number) {
    if (value === 0) {
      return 'blue';
    }
    if (value === maxValue) {
      return 'green';
    }
    const percent = value / maxValue;
    const blue = Math.round(255 * percent);
    const green = Math.round(255 * (1 - percent));
    return `rgb(${255 - green}, ${255 - blue}, 0)`;
    
  }

  private setColor(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'color', color);
  }

  //usage: <div appColoreRank [colorByValue]="value" [maxValue]="maxValue"></div>
  //import { ColoreRankDirective } from './directives/colore-rank.directive';
  //declarations: [ColoreRankDirective]

}
