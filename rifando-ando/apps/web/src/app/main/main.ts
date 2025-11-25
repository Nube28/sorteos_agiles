import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { InterfaceService } from '../global-services/interface.service';
import { CommonModule } from '@angular/common';
import { Alert } from "../global-components/alert/alert";

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, CommonModule, Alert],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  private interfaceService = inject(InterfaceService);

  currentRoute = signal('');

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.currentRoute.set(this.router.url);
    });
  }

  navigateTo(destination: string, queryParams?: Record<string, any>): void {
    const route = destination.toLowerCase();
    this.router.navigate([`/main/${route}`], {
      queryParams: queryParams
    });
  }

  get isEventActive() {
    return this.interfaceService.isEventActive();
  }

  get currentRouteValue(): string {
    return this.currentRoute();
  }

  get showMenuOptions(): boolean {
    const route = this.currentRoute();
    return route !== '/main/landing-page';
  }
}