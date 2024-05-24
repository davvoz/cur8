import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { HtmlConverterService } from '../services/html-converter.service';

@Directive({
  selector: '[appInterpretaHTML]',
  standalone: true
})
export class InterpretaHTMLDirective implements OnInit {
  @Input('appInterpretaHTML') content: string | undefined;

  constructor(private el: ElementRef, private renderer: Renderer2, private htmlConverter: HtmlConverterService) {}

  ngOnInit(): void {
    if (this.content) {
      const htmlContent = this.htmlConverter.convertToHTML(this.content);
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', htmlContent);
      this.htmlConverter.applyStyles();
    }
  }
}
//usage :
//import { InterpretaHTMLDirective } from './directives/interpreta-html.directive';
//imports: [InterpretaHTMLDirective],
//<div [appInterpretaHTML]="content"></div>