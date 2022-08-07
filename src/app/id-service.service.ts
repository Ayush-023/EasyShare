import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IdServiceService {
  IDs: any = new Map();
  characters: String =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  charactersLength = this.characters.length;

  constructor() {}

  private generateID() {
    let result = '';
    for (var i = 0; i < 5; i++) {
      result += this.characters.charAt(
        Math.floor(Math.random() * this.charactersLength)
      );
    }
    return result;
  }

  getID() {
    let id = this.generateID();

    while (this.IDs.has(id)) {
      id = this.generateID();
    }
    this.IDs[id] = true;
    return id;
  }

  removeID(id: any) {
    this.IDs.delete(id);
  }
}
