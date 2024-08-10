import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SwitchService {
  platform = 'HIVE';
  switchEmitter = new EventEmitter<string>();
  constructor() { }
  switchPlatform() {
    this.platform = 'HIVE';
    this.switchEmitter.emit(this.platform);
  }
  switch(platform: string) {
    this.platform = platform;
    this.switchEmitter.emit(platform);
  }
}
