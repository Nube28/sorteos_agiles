import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, firstValueFrom, from, map, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { IUsuario, RolUsuario } from 'libs/shared';

interface LoginResponse {
  accessToken: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private authBaseUrl = `${environment.apiBaseUrl}/auth`;
  private authBaseUrl = `http://localhost:3000/api/auth`;

  private currentUserSubject = new BehaviorSubject<IUsuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private httpClient = inject(HttpClient)
  private router = inject(Router)

  constructor() { }

  // Se ejecuta al iniciar la aplicación
  async initialize(): Promise<void> {
    if (this.hasToken()) {
      await this.loadCurrentUser();
    }
  }

  register(nombreUsuario: string, contrasenia: string, nombre: string, apellidos: string): Observable<IUsuario> {
    const rol: RolUsuario = RolUsuario.ORGANIZADOR; // cliente por defecto

    return this.httpClient.post<IUsuario>(`${this.authBaseUrl}/register`, {
      nombreUsuario,
      contrasenia,
      nombre,
      apellidos,
      rol
    });
  }

  login(nombreUsuario: string, contrasenia: string): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.authBaseUrl}/login`, {
      nombreUsuario,
      contrasenia
    }).pipe(
      switchMap(response => {
        this.setToken(response.accessToken);
        this.isAuthenticatedSubject.next(true);

        // promise en Observable y retornar la respuesta original
        return from(this.loadCurrentUser()).pipe(
          map(() => response) // Retornar la respuesta del login
        );
      })
    );
  }

  logout(): void {
    this.removeToken();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['main/landing-page']);
  }

  async loadCurrentUser(): Promise<void> {
    try {
      const user = await firstValueFrom(
        this.httpClient.get<IUsuario>(`${this.authBaseUrl}/me`)
      );
      this.currentUserSubject.next(user);
    } catch (error: any) {
      if (error.status === 401) {
        this.logout();
      }
      console.error('Error loading user:', error);
      throw error; // Re-lanzar para que el login lo maneje
    }
  }

  getCurrentUser(): IUsuario | null {
    return this.currentUserSubject.value;
  }

  private setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private removeToken(): void {
    localStorage.removeItem('access_token');
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
