import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { INumero, INumeroResponse, ISorteo } from 'libs/shared';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NumerosService {
    private apiURL = `http://localhost:3000/api/numeros`;
    private httpClient = inject(HttpClient);

    numeros = signal<INumero[]>([]);
    readonly numeros$ = this.numeros.asReadonly();

    numerosApartados = signal<{ sorteo: ISorteo; numeros: INumeroResponse[] }[]>([]);
    readonly numerosApartados$ = this.numerosApartados.asReadonly();

    getNumeros(sorteoId: string): Observable<INumero[]> {
        const url = `${this.apiURL}/sorteo/${sorteoId}/`;

        return this.httpClient.get<INumero[]>(url).pipe(
            tap(data => this.numeros.set(data)),
            catchError(error => {
                console.error('Error al cargar numeros:', error);
                return throwError(() => error);
            })
        );
    }

    getNumerosUsuarioId(): Observable<INumeroResponse[]> {
        const url = `${this.apiURL}/numeros-usuario`;

        return this.httpClient.get<INumeroResponse[]>(url).pipe(
            tap(data => {
                const grupos = this.groupBySorteo(data);
                this.numerosApartados.set(grupos);
            }),
            catchError(error => {
                console.error('Error al cargar numeros:', error);
                return throwError(() => error);
            })
        );
    }

    private groupBySorteo(numeros: INumeroResponse[]) {
        const map = new Map<string, { sorteo: any, numeros: INumeroResponse[] }>();

        numeros.forEach(num => {
            const sorteoId = typeof num.sorteo === 'object' && num.sorteo.id ? num.sorteo.id : String(num.sorteo);

            if (!map.has(sorteoId)) {
                map.set(sorteoId, {
                    sorteo: num.sorteo,
                    numeros: []
                });
            }

            map.get(sorteoId)!.numeros.push(num);
        });

        return Array.from(map.values());
    }


    reservarNumeros(sorteoId: string, numeros: number[]): Observable<any> {
        const url = `${this.apiURL}/reservar-cantidad`;

        const body = {
            sorteoId,
            numeros,
            fechaApartado: new Date().toISOString()
        };

        return this.httpClient.post<any>(url, body).pipe(
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
