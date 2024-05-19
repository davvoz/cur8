import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appInterpretaHTML]',
  standalone: true
})
export class InterpretaHTMLDirective implements OnInit {
  @Input('appInterpretaHTML') content: string | undefined;

  constructor(private el: ElementRef) {
    this.el = el;

  }

  ngOnInit(): void {
    if (this.content) {
      this.el.nativeElement.innerHTML = this.convertToHTML(this.content);
    }
  }

  convertToHTML(str: string): string {
    // Rimuovi i tag <center> e </center>
    str = str.replace(/<center>/g, '');
    str = str.replace(/<\/center>/g, '');
    // Aggiungi il tag <img> e il tag <a> al primo link
    str = str.replace(/\[!\[\]\((.*?)\)\]\((.*?)\)/g, '<a target="_blank"  href="$2"><img class="postImmagineGrande" src="$1" alt=""  style="width:100%; height: auto"></a>');
    // Aggiungi il tag <a> al secondo link
    str = str.replace(/▶️ \[(.*?)\]\((.*?)\)/g, '<br><a target="_blank"  class="postLink" href="$2">$1</a><br>');
    // Converti i titoli di livello 3 in tag <h3>
    str = str.replace(/### (.*?)\n/g, '<h3>$1</h3>');
    // Sostituisci i link diretti alle immagini con tag <img>
    str = str.replace(/\((https?:\/\/\S+?\.(?:jpg|png|gif))\)/g, '<br><img class="postImages" src="$1" alt="" style="max-width: 200px; height: auto;"><br>');
    //prevedi anche quelle che finiscono per .heic ed iniziano per https://images.ecency.com/  , è un immagine 
    str = str.replace(/\((https:\/\/images.ecency.com\/\S+?\.(?:heic))\)/g, '<br><img class="postImages" src="$1" alt="" style="max-width: 200px; height: auto;"><br>');
 //se sono link di soundcloud li trasformo in iframe
    str = str.replace(/\(https:\/\/soundcloud.com\/(.*?)\)/g, '<br><iframe class="postSoundcloud" width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/$1"></iframe><br>');
    // Rimuovi i link senza testo
    str = str.replace(/\[.*?\]/g, '');
    // Sostituisci il resto dei link con il testo del link
    str = str.replace(/\((https?:\/\/\S+?)\)/g, '<a target="_blank"  class="postLink" href="$1">$1</a>');
    // Formatta il testo in grassetto
    str = str.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Formatta il testo in corsivo
    str = str.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Barrato il testo
    str = str.replace(/~~(.*?)~~/g, '<del>$1</del>');
    // Formatta il testo come codice
    str = str.replace(/`(.*?)`/g, '<code>$1</code>');
    // Aggiungi una linea orizzontale
    str = str.replace(/---/g, '<hr>');
    // Tratta i paragrafi tra i caratteri "e"
    str = str.replace(/"(.*?)"\s+e\s+"(.*?)"/g, '"$1"</p><p>"$2"');
    // Quello che rimane è un paragrafo
    str = '<p class="postPara">' + str + '</p>';
    return str;
  }


}
//usage: <div appInterpretaHTML [appInterpretaHTML]="content"></div>
