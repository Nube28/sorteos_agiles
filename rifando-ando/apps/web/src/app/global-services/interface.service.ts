import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InterfaceService {
  menuSelected = signal<string>('Crear Sorteos');

  // Events
  isEventActive = signal<boolean>(false);
  titleEvent = signal('');
  messageEvent = signal('');
  eventCounter = signal(0);

  updateMenuSelected(newMenu: string) {
    this.menuSelected.set(newMenu);
  }

  toggleAlert(show: boolean) {
    this.isEventActive.set(show);
  }

  setEvent(title: string, message: string) {
    this.titleEvent.set(title);
    this.messageEvent.set(message);
    this.eventCounter.update(v => v + 1);
  }
}