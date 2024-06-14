import { EventEmitter, Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ModalService {
  
  isOpen = false;
  emitModalStatus = new EventEmitter<boolean>();

  constructor() { }

  closeModal() {
    this.isOpen = false;
    this.emitModalStatus.emit(this.isOpen);
  }

  openModal() {
    this.isOpen = true;
    this.emitModalStatus.emit(this.isOpen);
  }

}

