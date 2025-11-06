import { Component, computed, inject } from '@angular/core';
import { SorteoService } from '../../global-services/sorteo.service';
import { InterfaceService } from '../../global-services/interface.service';
@Component({
  selector: 'app-ver-sorteo',

  templateUrl: './ver-sorteo.html',
  styleUrl: '../../../styles.css',
})
export class VerSorteo {
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

