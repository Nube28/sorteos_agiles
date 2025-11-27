import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InterfaceService {
  // Events
  isEventActive = signal<boolean>(false);
  titleEvent = signal('');
  messageEvent = signal('');
  eventCounter = signal(0);

  loading = signal<boolean>(false);

  toggleAlert(show: boolean) {
    this.isEventActive.set(show);
  }

  setLoading(isLoading: boolean) {
    this.loading.set(isLoading);
  }

  setEvent(title: string, message: string) {
    this.titleEvent.set(title);
    this.messageEvent.set(message);
    this.eventCounter.update(v => v + 1);
  }
}