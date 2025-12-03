import { Component, inject, OnInit } from '@angular/core';
import { SorteoContainer } from "../sorteo-container/sorteo-container";
import { NumerosService } from '../../global-services/numero.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-consultar-numeros',
  imports: [SorteoContainer, DatePipe],
  templateUrl: './consultar-numeros.html',
  styleUrl: './consultar-numeros.css',
})
export class ConsultarNumeros implements OnInit {
  private numerosService = inject(NumerosService);

  numerosApartados$ = this.numerosService.numerosApartados$;

  ngOnInit(): void {
    this.numerosService.getNumerosUsuarioId().subscribe({
      error: (err) => {
        console.error('Error al obtener los números apartados:', err);
      }
    });
  }

  get numerosApartados() {
    return this.numerosService.getNumerosUsuarioId();
  }

  getNumerosSinPagar(grupo: { sorteo: any; numeros: any[] }): number {
    return grupo.numeros.filter(n => n.pagosId == null).length;
  }

  hasNumerosSinPagar(grupo: { sorteo: any; numeros: any[] }): boolean {
    return grupo.numeros.some(n => n.pagosId == null);
  }
}
