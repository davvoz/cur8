import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  //metodo per eseguire una richiesta GET
  async get(url: string, options?: any): Promise<any> {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  }

  //metodo per eseguire una richiesta POST
  async post(url: string, body: any, options?: any): Promise<any> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      ...options
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  }

  //metodo per eseguire una richiesta PUT
  async put(url: string, body: any, options?: any): Promise<any> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      ...options
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  }

  
  
}
