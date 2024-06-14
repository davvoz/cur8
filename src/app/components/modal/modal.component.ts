import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnChanges {

  @Input() callback: Function | undefined;
  @Input() title: string = 'Modal Title';
  @Input() message: string = 'Modal Message';
  @Input() path: string = 'assets/logoTra.png';
  @Input() conferma: string = 'Conferma';
  
  defaultPath: string = 'assets/logoTra.png';
  modalVisible: boolean = false;
  defaultVisible: boolean = false;
  inputDelegationVisible: boolean = false;
  inputDelegationValue = 0;
  inputUsernameVisible: boolean = false;
  inputUsernameValue = '';
  

  constructor(private modalService: ModalService) {
    this.modalService.emitModalStatus.subscribe((status: boolean) => {
      this.modalVisible = status;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
  }


  ngOnInit(): void {
  }

  action(): void {
    if (this.callback) {
      this.callback();
    }
  }

  closeModal(): void {
    this.modalService.closeModal();
  }


}

//usage: <app-modal [callback]="myFunction" [title]="myTitle" [message]="myMessage" [path]="myPath" [conferma]="myConferma"></app-modal>
