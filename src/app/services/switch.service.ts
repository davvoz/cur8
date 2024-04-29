import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SwitchService {
  platform = 'HIVE';
  switchEmitter = new EventEmitter<string>();
  constructor() { }
  switchPlatform() {
    this.platform = this.platform === 'HIVE' ? 'STEEM' : 'HIVE';
    this.switchEmitter.emit(this.platform);
  }
}
