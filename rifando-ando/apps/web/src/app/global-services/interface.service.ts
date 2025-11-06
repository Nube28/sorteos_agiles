import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InterfaceService {
  menuSelected = signal<string>('Crear Sorteos');

  updateMenuSelected(newMenu: string) {
    this.menuSelected.set(newMenu);
  }
}