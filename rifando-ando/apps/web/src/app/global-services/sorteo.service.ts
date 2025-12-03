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
    private sorteosLoaded = signal<boolean>(false);

    sorteo = signal<ISorteo | null>(null);
    sorteoData = signal<ISorteo | null>(null);
    readonly sorteo$ = this.sorteo.asReadonly();

    crearSorteo(sorteo: ISorteo): Observable<ISorteo> {
        // strings a números antes de enviar
        const sorteoData = {
            ...sorteo,
            costo: Number(sorteo.costo),
            cantidadNumeros: Number(sorteo.cantidadNumeros),
            tiempoLimitePago: Number(sorteo.tiempoLimitePago),
        };

        // ID temporal
        const tempId = `temp_${Date.now()}`;
        const sorteoOptimista = { ...sorteoData, id: tempId } as ISorteo;

        // Actualizar UI inmediatamente
        this.sorteos.update(sorteosActuales => [...sorteosActuales, sorteoOptimista]);

        return this.httpClient.post<ISorteo>(this.apiURL, sorteoData).pipe(
            tap((sorteoCreado) => {
                // Reemplazar sorteo temporal con el real del servidor cuando llegue
                this.sorteos.update(sorteosActuales =>
                    sorteosActuales.map(s => s.id === tempId ? sorteoCreado : s)
                );
            }),
            catchError(error => {
                // Revertir cambios si falla
                this.sorteos.update(sorteosActuales =>
                    sorteosActuales.filter(s => s.id !== tempId)
                );
                console.error('Error al crear sorteo:', error);
                return throwError(() => error);
            })
        );
    }

    getSorteos(forceRefresh = false): Observable<ISorteo[]> {
        // Si ya tenemos datos cargados y no es refresh forzado, retornar los datos actuales
        if (this.sorteosLoaded() && !forceRefresh) {
            return new Observable(observer => {
                observer.next(this.sorteos());
                observer.complete();
            });
        }

        return this.httpClient.get<ISorteo[]>(this.apiURL).pipe(
            tap(data => {
                this.sorteos.set(data);
                this.sorteosLoaded.set(true);
            }),
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

        // Guardar estado anterior para rollback
        const sorteoAnterior = this.sorteos().find(s => s.id === sorteoId);
        const sorteoDetalleAnterior = this.sorteo();

        // Actualizar UI inmediatamente
        const sorteoOptimista = { ...sorteoAnterior, ...sorteoData, id: sorteoId } as ISorteo;

        this.sorteo.set(sorteoOptimista);
        this.sorteos.update(lista =>
            lista.map(s => s.id === sorteoId ? sorteoOptimista : s)
        );

        return this.httpClient.patch<ISorteo>(url, sorteoData).pipe(
            tap(sorteoActualizado => {
                // Actualizar con datos reales del servidor cuando llegue
                this.sorteo.set(sorteoActualizado);
                this.sorteos.update(lista =>
                    lista.map(s => s.id === sorteoId ? sorteoActualizado : s)
                );
            }),
            catchError(error => {
                // Revertir a estado anterior si falla
                if (sorteoAnterior) {
                    this.sorteos.update(lista =>
                        lista.map(s => s.id === sorteoId ? sorteoAnterior : s)
                    );
                }
                if (sorteoDetalleAnterior?.id === sorteoId) {
                    this.sorteo.set(sorteoDetalleAnterior);
                }
                console.error('Error al actualizar sorteo:', error);
                return throwError(() => error);
            })
        );
    }

    eliminarSorteo(sorteoId: string): Observable<void> {
        const url = `${this.apiURL}/${sorteoId}`;

        // Guardar estado anterior para rollback
        const sorteoEliminado = this.sorteos().find(s => s.id === sorteoId);
        const sorteoDetalleAnterior = this.sorteo();

        // Actualizar UI inmediatamente
        this.sorteos.update((lista) =>
            lista.filter((s) => s.id !== sorteoId)
        );

        if (this.sorteo()?.id === sorteoId) {
            this.sorteo.set(null);
        }

        return this.httpClient.delete<void>(url).pipe(
            catchError((error) => {
                // Revertir cambios si falla
                if (sorteoEliminado) {
                    this.sorteos.update((lista) => [...lista, sorteoEliminado]);
                }
                if (sorteoDetalleAnterior?.id === sorteoId) {
                    this.sorteo.set(sorteoDetalleAnterior);
                }
                console.error('Error al eliminar sorteo:', error);
                return throwError(() => error);
            })
        );
    }
}