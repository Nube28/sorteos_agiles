import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { INumero } from 'libs/shared';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NumerosService {
    // esto debería ser variable de entorno
    private apiURL = `http://localhost:3000/api/numeros`;
    private httpClient = inject(HttpClient);

    numeros = signal<INumero[]>([]);
    readonly numeros$ = this.numeros.asReadonly();

    getNumeros(sorteoId: string): Observable<INumero[]> {
        const url = `${this.apiURL}/${sorteoId}`;

        return this.httpClient.get<INumero[]>(url).pipe(
            tap(data => this.numeros.set(data)),
            catchError(error => {
                console.error('Error al cargar numeros:', error);
                return throwError(() => error);
            })
        );
    }

    reservarNumeros(sorteoId: string, numeros: number[], clienteId: string): Observable<any> {
        const url = `${this.apiURL}/reservar-cantidad`; 
        
        const body = {
            sorteoId,
            numeros,
            clienteId, 
            fechaApartado: new Date().toISOString() 
        };

        return this.httpClient.post(url, body).pipe(
            tap(() => {
                this.getNumeros(sorteoId).subscribe();
            }),
            catchError(error => {
                console.error('Error al apartar números:', error);
                return throwError(() => error);
            })
        );
    }
}