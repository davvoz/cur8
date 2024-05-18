import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
//forms ngModel
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [FormsModule, JsonPipe],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {
  post() {
    this.creaElemento(this.nome);
  }
  nome: any;
  get() {
    this.geyElementoById();
  }
  //connettiamoci a pythonenywhere     server = await websockets.serve(echo, "0.0.0.0", 8765)

  elementi: any[] = [];
  backend = {
    "create_elemento": "http://luciogiolli.pythonanywhere.com/api/elementi (POST)",
    "delete_elemento": "http://luciogiolli.pythonanywhere.com/api/elementi/id (DELETE)",
    "get_elementi": "http://luciogiolli.pythonanywhere.com/api/elementi (GET)",
    "get_elemento_by_id": "http://luciogiolli.pythonanywhere.com/api/elementi/id (GET)",
    "update_elemento": "http://luciogiolli.pythonanywhere.com/api/elementi/id (PUT)"
  };
  id: number = 0;
  constructor(private apiService: ApiService) { this.caricaElementi(); }

  ngOnInit(): void {

  }


  caricaElementi() {
    this.apiService.get('https://luciogiolli.pythonanywhere.com/api/elementi')
      .then((elementi: any) => {
        console.log(elementi);
        this.elementi = elementi;
      }).catch((err: any) => {
        console.error(err);
      }).finally(() => {
        console.log('Chiamata completata');
      });

  }

  elementoById: any;
  geyElementoById() {
    this.apiService.get(`https://luciogiolli.pythonanywhere.com/api/elementi/${this.id}`)
      .then((elemento: any) => {
        console.log(elemento);
        this.elementoById = elemento;
      }).catch((err: any) => {
        console.error(err);
      }).finally(() => {
        console.log('Chiamata completata');
      });
  }

  creaElemento(nome: string) {
    this.apiService.post('https://luciogiolli.pythonanywhere.com/api/elementi/crea/', { nome })
  }

}
