import { Component, computed, inject, OnInit } from '@angular/core';
import { SorteoService } from '../../global-services/sorteo.service';
import { InterfaceService } from '../../global-services/interface.service';
import { SorteoContainer } from "../sorteo-container/sorteo-container";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ver-sorteos',
  templateUrl: './ver-sorteos.html',
  styleUrl: './ver-sorteos.css',
  imports: [SorteoContainer],
})
export class VerSorteos implements OnInit {
  private sorteoService = inject(SorteoService);
  private interfaceService = inject(InterfaceService);
  private router = inject(Router)

  private rawSorteos = this.sorteoService.sorteos$;

  ngOnInit() {
    this.sorteoService.getSorteos().subscribe({
      next: () => {
        // pantalla de carga finalizada hay que ponerle, to do
      },
      error: (err) => {
        console.error('Error al obtener los sorteos en VerSorteos:', err);
      }
    });
    this.interfaceService.updateMenuSelected('Ver Sorteos');
  }

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

  verDetalles(sorteoId: Number) {
    this.router.navigate(['/main/detalles-sorteo', sorteoId]);
  }
}

