import { EventEmitter, Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UserMemoryService {
  userName: string = '';
  userEmitter = new EventEmitter<string>();
  constructor() { }

  setUser(userName: string) {
    this.userName = userName;
    this.userEmitter.emit(userName);
  }
}