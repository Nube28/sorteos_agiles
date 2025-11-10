import { Component, computed, inject } from '@angular/core';
import { SorteoService } from '../../global-services/sorteo.service';
import { InterfaceService } from '../../global-services/interface.service';
import { SorteoContainer } from "../sorteo-container/sorteo-container";
@Component({
  selector: 'app-ver-sorteos',
  templateUrl: './ver-sorteos.html',
  styleUrl: './ver-sorteos.css',
  imports: [SorteoContainer],
})
export class VerSorteos {
  private sorteoService = inject(SorteoService);
  private interfaceService = inject(InterfaceService);

  private rawSorteos = this.sorteoService.sorteos$;


  sorteos = computed(() => {
    return this.rawSorteos().map((sorteo) => ({
      ...sorteo,
      nombre: sorteo.nombre,
      fecha: new Date(sorteo.fechaSorteo).toLocaleDateString(),
      numerosDisponibles: (sorteo.cantidadNumeros || 0),
      numerosTotales: (sorteo.cantidadNumeros || 0)
    }));
  }
  );
  ngOnInit() {
    this.interfaceService.updateMenuSelected('Ver Sorteos');
  }
}

