import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
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
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  currentRoute = signal('');
  currentFilter = signal<string | null>(null);

  constructor() {
    // Setear la ruta actual y el filtro al iniciar y al cambiar de ruta
    this.router.events.subscribe(() => {
      this.currentRoute.set(this.router.url.split('?')[0]);
    });

    // Seetear el filtro al iniciar y al cambiar de parámetros
    this.activatedRoute.queryParams.subscribe(params => {
      this.currentFilter.set(params['filter'] || null);
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

  isActive(routePath: string, filter?: string): boolean {
    if (filter) {
      return this.currentRoute() === routePath && this.currentFilter() === filter;
    }
    return this.currentRoute() === routePath && !this.currentFilter();
  }
}