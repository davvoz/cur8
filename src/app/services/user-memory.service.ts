import { Injectable } from '@angular/core';
import { Emitter } from 'tone';

@Injectable({
  providedIn: 'root'
})
export class UserMemoryService {
  userName: string = '';
  userEmitter : Emitter = new Emitter<string>();
  constructor() { }

  setUser(userName: string){
    this.userName = userName;
    this.userEmitter.emit(userName);
  }
}