import { Component, computed, inject, OnInit } from '@angular/core';
import { InterfaceService } from '../../global-services/interface.service';
import { SorteoService } from '../../global-services/sorteo.service';
import { RouterLink } from '@angular/router';
import { SorteoComponent } from '../../global-components/sorteo/sorteo.component';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, SorteoComponent],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage implements OnInit {
  private sorteoService = inject(SorteoService);
  private interfaceService = inject(InterfaceService);

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
    return this.rawSorteos()
      .slice(0, 3) // primeros 3 sorteos maybe mas populares luego
      .map((sorteo) => ({
        ...sorteo,
        nombre: sorteo.nombre,
        fecha: new Date(sorteo.fechaSorteo).toLocaleDateString(),
        numerosDisponibles: (sorteo.cantidadNumeros || 0),
        numerosTotales: (sorteo.cantidadNumeros || 0)
      }));
  });

  // Calcular cuántos fallbacks mostrar (siempre 3 total)
  fallbackCount = computed(() => {
    const realCount = this.sorteos().length;
    return Math.max(0, 3 - realCount);
  });

  // Array auxiliar para el @for de fallbacks
  fallbackArray = computed(() => {
    return Array(this.fallbackCount()).fill(0);
  });

}
