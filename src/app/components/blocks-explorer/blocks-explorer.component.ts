import { Component} from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatCardContent } from '@angular/material/card';
import { MatCardTitle } from '@angular/material/card';
import { MatCardSubtitle } from '@angular/material/card';
import { MatCardActions } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCardImage } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
//ngFor
import { NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
//dhive websocket client
//datapipe 
import { DatePipe } from '@angular/common';
//importa lo spinner
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
//mat divider
import { MatDivider } from '@angular/material/divider';
import { TempoInMinutiPipe } from "../pipes/tempo-in-minuti.pipe";
interface Root {
  op: string
  x: X,
  valoreTotaleIn: number,
  valoreTotaleOut: number
}

interface X {
  lock_time: number
  ver: number
  size: number
  inputs: Input[]
  time: number
  tx_index: number
  vin_sz: number
  hash: string
  vout_sz: number
  relayed_by: string
  out: Out[]
}

interface Input {
  sequence: number
  prev_out: PrevOut
  script: string
}

interface PrevOut {
  spent: boolean
  tx_index: number
  type: number
  addr: string
  value: number
  n: number
  script: string
}

interface Out {
  spent: boolean
  tx_index: number
  type: number
  addr: string
  value: number
  n: number
  script: string
}


@Component({
    selector: 'app-blocks-explorer',
    standalone: true,
    templateUrl: './blocks-explorer.component.html',
    styleUrl: './blocks-explorer.component.scss',
    imports: [MatDivider, NgIf, MatCard, MatCardContent, MatCardTitle, MatCardSubtitle, MatCardActions, MatProgressSpinnerModule, MatButton, MatIcon, MatCardImage, NgFor, MatExpansionModule, DatePipe, TempoInMinutiPipe]
})
export class BlocksExplorerComponent {

  blockchain: Root[] = [];
  panelOpenState = false;
  message = { op: 'unconfirmed_sub' };
  private subject: WebSocket;
  selectedFunction: any;
  private uri = 'wss://ws.blockchain.info/inv';

  buttons = [{
    label: 'Tempo',
    action: this.ordinaPer('tempo')
  }, {
    label: 'Valore In',
    action: this.ordinaPer('valoreIn')
  }, {
    label: 'Valore Out',
    action: this.ordinaPer('valoreOut')
  }, {
    label: 'Sommatoria',
    action: this.ordinaPer('sommatoria')
  }];
  isMobile = window.innerWidth < 768;


  constructor() {
    this.isMobile = window.innerWidth < 768;

    this.subject = new WebSocket(this.uri);
    this.subject.onopen = () => {
      console.log('Connected to the blockchain.info websocket');
      this.subject.send(JSON.stringify(this.message));
    };

    this.subject.onmessage = (msg: any) => { // Specify the type of 'msg' as 'MessageEvent'
      console.log(msg);
    };

    this.getData().subscribe((data: any) => {

      const dataD = JSON.parse(data);

      const block: Root = {
        op: dataD.op,
        x: dataD.x,
        valoreTotaleIn: this.caclcolaValoreTotaleIn(dataD.x),
        valoreTotaleOut: this.caclcolaValoreTotaleOut(dataD.x)
      };
      //usa i soli blocchi che hanno un timestamp > 0
      if (block.x.lock_time > 0) {
        this.blockchain.push(block);
      }
     
    });
  }
  caclcolaValoreTotaleOut(x: X): number {
    let somma = 0;
    for (let i = 0; i < x.out.length; i++) {
      somma += x.out[i].value;
    }
    return somma;
  }
  caclcolaValoreTotaleIn(x: X): number {
    let somma = 0;
    for (let i = 0; i < x.inputs.length; i++) {
      somma += x.inputs[i].prev_out.value;
    }
    return somma;
  }

  ordinaPer(arg0: string) {
    switch (arg0) {
      case 'tempo':
        this.selectedFunction = this.ordinaPerTempo();
        break;
      case 'valoreIn':
        this.selectedFunction = this.ordinaPerValoreIn();
        break;
      case 'valoreOut':
        this.selectedFunction = this.ordinaPerValoreOut();
        break;
      case 'sommatoria':
        this.selectedFunction = this.ordinaPerSommatoria();
        break;
      default:
        break;
    }
    this.blockchain.sort(this.selectedFunction as any);
  }
  ordinaPerSommatoria(): ((a: Root, b: Root) => number) | undefined {
    return (a, b) => a.valoreTotaleIn + a.valoreTotaleOut - (b.valoreTotaleIn + b.valoreTotaleOut);
  }
  ordinaPerValoreOut(): ((a: Root, b: Root) => number) | undefined {
    return (a, b) => a.valoreTotaleOut - b.valoreTotaleOut;
  }
  ordinaPerValoreIn(): ((a: Root, b: Root) => number) | undefined {
    return (a, b) => a.valoreTotaleIn - b.valoreTotaleIn;
  }

  private ordinaPerTempo(): ((a: Root, b: Root) => number) | undefined {
    return (a, b) => a.x.lock_time - b.x.lock_time;
  }

  getData(): Observable<any> {
    return new Observable(observer => {
      this.subject.onmessage = (event) => {
        const data = event.data;
        if (data) {
          try {
            observer.next(data);
          } catch (e) {
            observer.error(e);
          }
        } else {
          console.log('No data received from server, sending precedent data');
        }
      };

      this.subject.onerror = (error) => {
        observer.error(error);
      };
    });
  }


}
