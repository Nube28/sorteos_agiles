import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Numero, Sorteo } from '@prisma/client';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NumerosService {
    // esto debería ser variable de entorno
    private apiURL = `http://localhost:3000/api/numeros`;
    private httpClient = inject(HttpClient);

    numeros = signal<Numero[]>([]);
    readonly sorteos$ = this.numeros.asReadonly();

    getNumeros(sorteoId: Number): Observable<Numero[]> {
        const url = `${this.apiURL}/${sorteoId}`;

        return this.httpClient.get<Numero[]>(url).pipe(
            tap(data => this.numeros.set(data)),
            catchError(error => {
                console.error('Error al cargar numeros:', error);
                return throwError(() => error);
            })
        );
    }
}
