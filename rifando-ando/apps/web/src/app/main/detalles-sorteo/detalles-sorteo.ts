import { Component, inject, OnDestroy, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SorteoContainer } from "../sorteo-container/sorteo-container";
import { ActivatedRoute } from '@angular/router';
import { SorteoService } from '../../global-services/sorteo.service';
import { forkJoin, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NumerosService } from '../../global-services/numero.service';
import { Numero } from '@prisma/client';
@Component({
  selector: 'app-detalles-sorteo',
  imports: [SorteoContainer, CommonModule, FormsModule],
  templateUrl: './detalles-sorteo.html',
  styleUrl: './detalles-sorteo.css',
})
export class DetallesSorteo {
  private activatedRoute = inject(ActivatedRoute)
  sorteoService = inject(SorteoService)
  private numerosService = inject(NumerosService)

  sorteo = this.sorteoService.sorteo;
  numeros = this.numerosService.numeros;

  constructor() {
    this.activatedRoute.paramMap.pipe(
      tap(() => {
        this.sorteoService.sorteo.set(null);
        this.numeros.set([]);
      }),
      switchMap(params => {
        const sorteoId = +params.get('id')!;
        // Combina ambas llamadas
        return forkJoin({
          sorteo: this.sorteoService.getSorteoPorId(sorteoId),
          numeros: this.numerosService.getNumeros(sorteoId)
        });
      }),
      tap(({ numeros }) => {
        this.numeros.set(numeros);
      }),
      takeUntilDestroyed()
    ).subscribe();
  }

  get numerosDisponibles(): number {
    if (!this.sorteo()) return 0;
    // cantidad numeros del sorteo menos numeros existentes (están apartados o pagados)
    return this.sorteo().cantidadNumeros - this.numeros().length;
  }

  // pendiente, se hace ya que se agregue el formulario de compra de numeros, i aint doing all that
  totalCalculado = computed(() => {
    if (!this.sorteo()) return 0;
    const costo = this.sorteo().costo;
    const cantidadNumeros = this.sorteo().cantidadNumeros;
    return costo * cantidadNumeros;
  });
}
// Lo quité, esto solo setea nulo, no desuscribe, mejor takeUntilDestroy()
// ngOnDestroy(): void {
//   this.sorteoService.sorteo.set(null)
// }
