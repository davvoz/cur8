import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  isOpen = true;
  emitter = new EventEmitter<boolean>();
  constructor() { }

  toggle() {
    console.log('Toggling sidebar state to', !this.isOpen);
    this.isOpen = !this.isOpen;
    this.emitter.emit(this.isOpen);
  }
}
