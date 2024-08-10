import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SwitchService {
  platform = 'STEEM';
  switchEmitter = new EventEmitter<string>();
  constructor() { }
  switchPlatform() {
    this.platform = 'STEEM';
    this.switchEmitter.emit(this.platform);
  }
  switch(platform: string) {
    this.platform = platform;
    this.switchEmitter.emit(platform);
  }
}
