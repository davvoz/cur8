import { Component } from '@angular/core';
import { InterpretaHTMLDirective } from '../../directives/interpreta-html.directive';
import { GlobalPropertiesSteemService } from '../../services/global-properties-steem.service';
@Component({
  selector: 'app-lista-post-steem',
  standalone: true,
  imports: [InterpretaHTMLDirective],
  templateUrl: './lista-post.component.html',
  styleUrl: './lista-post.component.scss'
})
export class ListaPostComponent {
  content: any;
  constructor(private gb: GlobalPropertiesSteemService) {
    this.content = this.gb.getListaPost();
  }
}
