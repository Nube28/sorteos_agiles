import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ISorteo } from 'libs/shared';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SorteoService {
    // esto debería ser variable de entorno
    private apiURL = `http://localhost:3000/api/sorteos`;
    private httpClient = inject(HttpClient);

    sorteos = signal<ISorteo[]>([]);
    readonly sorteos$ = this.sorteos.asReadonly();

    sorteo = signal<ISorteo | null>(null);
    sorteoData = signal<ISorteo | null>(null);
    readonly sorteo$ = this.sorteo.asReadonly();

    crearSorteo(sorteo: ISorteo, nombreOrganizador: string): Observable<ISorteo> {
        // convertir strings a números antes de enviar
        const sorteoData = {
            ...sorteo,
            costo: Number(sorteo.costo),
            // cantidad de numeros si lo ocupamos, tenemos que saber el limite
            cantidadNumeros: Number(sorteo.cantidadNumeros),
            tiempoLimitePago: Number(sorteo.tiempoLimitePago),
            nombreOrganizador: nombreOrganizador
        };

        // Vamos a implementar optimistic ui aqui
        return this.httpClient.post<ISorteo>(this.apiURL, sorteoData).pipe(
            tap((sorteoCreado) => { this.sorteos.update(sorteosActuales => [...sorteosActuales, sorteoCreado]); }),
            catchError(error => {
                console.error('Error al crear sorteo:', error);
                return throwError(() => error);
            })
        );
    }

    // Mejoras, lo cambié para que regresen el observable
    // Se debe de manejar en el componente, si tira error en el servicio
    // No había manera de que el commponente lo supiera + se puede implementar pantalla de carga
    // i think we should be using dtos in here, cuz, we souldn't be exposing the ids
    getSorteos(): Observable<ISorteo[]> {
        return this.httpClient.get<ISorteo[]>(this.apiURL).pipe(
            tap(data => this.sorteos.set(data)),
            catchError(error => {
                console.error('Error al cargar sorteos:', error);
                return throwError(() => error);
            })
        );
    }

    getSorteoPorId(sorteoId: number): Observable<ISorteo> {
        const url = `${this.apiURL}/${sorteoId}`;

        return this.httpClient.get<ISorteo>(url).pipe(
            tap(data => this.sorteo.set(data)),
            catchError(error => {
                console.error('Error al cargar sorteo:', error);
                return throwError(() => error);
            })
        );
    }

    getOrganizadorPorNombre(sorteoId: number): Observable<ISorteo> {
        const url = `${this.apiURL}/${sorteoId}`;

        return this.httpClient.get<ISorteo>(url).pipe(
            tap(data => this.sorteo.set(data)),
            catchError(error => {
                console.error('Error al cargar sorteo:', error);
                return throwError(() => error);
            })
        );
    }

    actualizarSorteo(sorteoId: number, datos: Partial<ISorteo>): Observable<ISorteo> {
        const url = `${this.apiURL}/${sorteoId}`;

        const sorteoData = {
            ...datos,
            costo: Number(datos.costo),
            cantidadNumeros: Number(datos.cantidadNumeros),
            tiempoLimitePago: Number(datos.tiempoLimitePago),
        };

        return this.httpClient.patch<ISorteo>(url, sorteoData).pipe(
            tap(sorteoActualizado => {
                this.sorteo.set(sorteoActualizado);
                this.sorteos.update(lista =>
                    lista.map(s => s.id === sorteoId ? sorteoActualizado : s)
                );
            }),
            catchError(error => {
                console.error('Error al actualizar sorteo:', error);
                return throwError(() => error);
            })
        );
    }
}
