import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { InterfaceService } from '../global-services/interface.service';
import { CommonModule } from '@angular/common';
import { Alert } from "../global-components/alert/alert";
import { AuthService } from '../global-services/auth.service';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, RouterLink, CommonModule, Alert],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  private interfaceService = inject(InterfaceService);
  private authService = inject(AuthService);

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

  logout(): void {
    this.authService.logout();
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

  get usuario() {
    return this.authService.getCurrentUser();
  }
}