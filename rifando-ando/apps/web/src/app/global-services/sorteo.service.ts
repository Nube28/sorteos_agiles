import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Sorteo } from '@prisma/client';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SorteoService {
    // esto debería ser variable de entorno
    private apiURL = `http://localhost:3000/api/sorteos`;
    private httpClient = inject(HttpClient);

    sorteos = signal<Sorteo[]>([]);
    readonly sorteos$ = this.sorteos.asReadonly();

    sorteo = signal<Sorteo | null>(null);
    readonly sorteo$ = this.sorteo.asReadonly();

    // aqui también falta cambiar a lo mismo de abajo, regresar observables
    crearSorteo(sorteo: Sorteo) {
        try {
            // convertir strings a números antes de enviar
            const sorteoData = {
                ...sorteo,
                costo: Number(sorteo.costo),
                cantidadNumeros: Number(sorteo.cantidadNumeros),
                tiempoLimitePago: Number(sorteo.tiempoLimitePago),
                numerosDisponibles: Number(sorteo.cantidadNumeros),
                organizadorId: 1
            };
            return this.httpClient.post(this.apiURL, sorteoData);
        } catch (error) {
            console.log(error);
        }
    }

    // Mejoras, lo cambié para que regresen el observable
    // Se debe de manejar en el componente, si tira error en el servicio
    // No había manera de que el commponente lo supiera + se puede implementar pantalla de carga
    // i think we should be using dtos in here, cuz, we souldn't be exposing the ids
    getSorteos(): Observable<Sorteo[]> {
        return this.httpClient.get<Sorteo[]>(this.apiURL).pipe(
            tap(data => this.sorteos.set(data)),
            catchError(error => {
                console.error('Error al cargar sorteos:', error);
                return throwError(() => error);
            })
        );
    }

    getSorteoPorId(sorteoId: number): Observable<Sorteo> {
        const url = `${this.apiURL}/${sorteoId}`;

        return this.httpClient.get<Sorteo>(url).pipe(
            tap(data => this.sorteo.set(data)),
            catchError(error => {
                console.error('Error al cargar sorteo:', error);
                return throwError(() => error);
            })
        );
    }
}
