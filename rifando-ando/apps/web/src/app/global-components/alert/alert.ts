import { Component, effect, inject, Input, signal } from '@angular/core';
import { InterfaceService } from '../../global-services/interface.service';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
})
export class Alert {
  private interfaceService = inject(InterfaceService);
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private closeTimeoutId: ReturnType<typeof setTimeout> | null = null;

  // para rastrear el último evento mostrado.
  private lastEventCount = 0;

  displayTitle = signal('');
  displayMessage = signal('');
  isVisible = signal(false);
  isFadingOut = signal(false);

  constructor() {
    effect(() => {
      const newEventCount = this.interfaceService.eventCounter();
      const isActive = this.interfaceService.isEventActive();

      if (newEventCount > this.lastEventCount && isActive) {
        this.lastEventCount = newEventCount;
        this.showEvent();
      }
    });
  }

  private showEvent() {
    if (this.isVisible()) {
      this.closeEvent(true);
    } else {
      this._displayEvent();
    }
  }

  closeEvent(isTransitioning = false) {
    if (this.isFadingOut() || !this.isVisible()) {
      return;
    }
    this.isFadingOut.set(true);
    this.clearTimeouts();
    this.closeTimeoutId = setTimeout(() => {
      if (isTransitioning) {
        this._displayEvent();
      } else {
        this.isVisible.set(false);
        this.isFadingOut.set(false);
        this.interfaceService.toggleAlert(false);
      }
    }, 500);
  }

  private _displayEvent() {
    this.clearTimeouts();
    this.isFadingOut.set(false);
    this.displayTitle.set(this.interfaceService.titleEvent());
    this.displayMessage.set(this.interfaceService.messageEvent());
    this.isVisible.set(true);
    this.timeoutId = setTimeout(() => {
      this.closeEvent();
    }, 4000);
  }

  private clearTimeouts() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    if (this.closeTimeoutId) clearTimeout(this.closeTimeoutId);
  }

  ngOnDestroy() {
    this.clearTimeouts();
  }
}
