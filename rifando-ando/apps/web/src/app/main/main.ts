import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { InterfaceService } from '../global-services/interface.service';
import { CommonModule } from '@angular/common';
import { Alert } from "../global-components/alert/alert";

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, CommonModule, RouterLink, Alert],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  private interfaceService = inject(InterfaceService);

  currentRoute = signal('');
  showMenuOptions = computed(() => this.currentRoute() !== '/main/landing-page');

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.currentRoute.set(this.router.url);
    });
  }

  updateMenuSelected(newMenu: string) {
    this.interfaceService.updateMenuSelected(newMenu);
  }

  onMenuClick(menu: string) {
    this.updateMenuSelected(menu);
  }

  get menuSelected() {
    return this.interfaceService.menuSelected();
  }

  get isEventActive() {
    return this.interfaceService.isEventActive();
  }
}
