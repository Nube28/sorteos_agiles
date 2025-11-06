import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Sorteo } from '@prisma/client';

@Injectable({
    providedIn: 'root',
})
export class SorteoService {
    private apiURL = `http://localhost:3000/api/sorteos`;
    private httpClient = inject(HttpClient);

    sorteos = signal<Sorteo[]>([]);
    readonly sorteos$ = this.sorteos.asReadonly();

    crearSorteo(sorteo: Sorteo) {
        try {
            // convertir strings a números antes de enviar
            const sorteoData = {
                ...sorteo,
                costo: Number(sorteo.costo),
                cantidadNumeros: Number(sorteo.cantidadNumeros),
                tiempoLimitePago: Number(sorteo.tiempoLimitePago),
                organizadorId: 1
            };
            return this.httpClient.post(this.apiURL, sorteoData);
        } catch (error) {
            console.log(error);
        }
    }
}
