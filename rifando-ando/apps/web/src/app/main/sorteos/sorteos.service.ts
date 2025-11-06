import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Sorteo, CreateSorteoDto } from '@rifando-ando/dtos'; 

@Injectable({
    providedIn: 'root'
})
export class SorteosService {

    private http = inject(HttpClient);

    private apiUrl = '/api/sorteos';

    getSorteos(): Observable<Sorteo[]> {
        return this.http.get<Sorteo[]>(this.apiUrl);
    }

    createSorteo(sorteoDto: CreateSorteoDto): Observable<Sorteo> {
        return this.http.post<Sorteo>(this.apiUrl, sorteoDto);
    }
}