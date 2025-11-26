import { Component, computed, inject, OnInit } from '@angular/core';
import { SorteoService } from '../../global-services/sorteo.service';
import { SorteoContainer } from "../sorteo-container/sorteo-container";
import { Router } from '@angular/router';
import { SorteoComponent } from "../../global-components/sorteo/sorteo.component";

@Component({
  selector: 'app-ver-sorteos',
  templateUrl: './ver-sorteos.html',
  styleUrl: './ver-sorteos.css',
  imports: [SorteoContainer, SorteoComponent],
})
export class VerSorteos implements OnInit {
  private sorteoService = inject(SorteoService);
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

  verDetalles(sorteoId: string) {
    this.router.navigate(['/main/detalles-sorteo', sorteoId]);
  }
}

