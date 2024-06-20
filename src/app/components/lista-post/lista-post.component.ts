import { Component } from '@angular/core';
import { InterpretaHTMLDirective } from '../../directives/interpreta-html.directive';
import { GlobalPropertiesHiveService } from '../../services/global-properties-hive.service';
@Component({
  selector: 'app-lista-post',
  standalone: true,
  imports: [InterpretaHTMLDirective],
  templateUrl: './lista-post.component.html',
  styleUrl: './lista-post.component.scss'
})
export class ListaPostComponent {
  content: any;
  constructor(private gb: GlobalPropertiesHiveService) {
    this.content = this.gb.getListaPost();
  }
}
