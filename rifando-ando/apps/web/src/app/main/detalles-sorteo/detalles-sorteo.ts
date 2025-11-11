import { Component, inject, OnDestroy, signal ,computed} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SorteoContainer } from "../sorteo-container/sorteo-container";
import { ActivatedRoute } from '@angular/router';
import { SorteoService } from '../../global-services/sorteo.service';
import { switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-detalles-sorteo',
  imports: [SorteoContainer, CommonModule, FormsModule],
  templateUrl: './detalles-sorteo.html',
  styleUrl: './detalles-sorteo.css',
})
export class DetallesSorteo {
  private activatedRoute = inject(ActivatedRoute)
  private sorteoService = inject(SorteoService)

  sorteo = this.sorteoService.sorteo;
  cantidadApartar = signal(1);

  totalCalculado = computed(() => {
    const s = this.sorteo();
    const c = this.cantidadApartar();
    if (!s || !c || c <= 0) {
      return 0;
    }
    return c * s.costo;
  });
  constructor() {
    this.activatedRoute.paramMap.pipe(
      tap(() => this.sorteoService.sorteo.set(null)),
      switchMap(params => this.sorteoService.getSorteoPorId(+params.get('id')!)),
      takeUntilDestroyed()
    ).subscribe();
  }
}

// Lo quité, esto solo setea nulo, no desuscribe, mejor takeUntilDestroy()
// ngOnDestroy(): void {
//   this.sorteoService.sorteo.set(null)
// }
