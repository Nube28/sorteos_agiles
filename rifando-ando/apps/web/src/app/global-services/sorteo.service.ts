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

    crearSorteo(sorteo: ISorteo): Observable<ISorteo> {
        // convertir strings a números antes de enviar
        const sorteoData = {
            ...sorteo,
            costo: Number(sorteo.costo),
            cantidadNumeros: Number(sorteo.cantidadNumeros),
            tiempoLimitePago: Number(sorteo.tiempoLimitePago),
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

    getSorteos(): Observable<ISorteo[]> {
        return this.httpClient.get<ISorteo[]>(this.apiURL).pipe(
            tap(data => this.sorteos.set(data)),
            catchError(error => {
                console.error('Error al cargar sorteos:', error);
                return throwError(() => error);
            })
        );
    }

    getSorteoPorId(sorteoId: string): Observable<ISorteo> {
        const url = `${this.apiURL}/${sorteoId}`;

        return this.httpClient.get<ISorteo>(url).pipe(
            tap(data => this.sorteo.set(data)),
            catchError(error => {
                console.error('Error al cargar sorteo:', error);
                return throwError(() => error);
            })
        );
    }

    getOrganizadorPorNombre(sorteoId: string): Observable<ISorteo> {
        const url = `${this.apiURL}/${sorteoId}`;

        return this.httpClient.get<ISorteo>(url).pipe(
            tap(data => this.sorteo.set(data)),
            catchError(error => {
                console.error('Error al cargar sorteo:', error);
                return throwError(() => error);
            })
        );
    }

    actualizarSorteo(sorteoId: string, datos: Partial<ISorteo>): Observable<ISorteo> {
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
    eliminarSorteo(sorteoId: string): Observable<void> {
        const url = `${this.apiURL}/${sorteoId}`;

        return this.httpClient.delete<void>(url).pipe(
            tap(() => {
                this.sorteos.update((lista) =>
                    lista.filter((s) => s.id !== sorteoId)
                );

                if (this.sorteo()?.id === sorteoId) {
                    this.sorteo.set(null);
                }
            }),
            catchError((error) => {
                console.error('Error al eliminar sorteo:', error);
                return throwError(() => error);
            })
        );
    }

}
