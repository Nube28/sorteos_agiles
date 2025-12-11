import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { SorteoService } from '../../global-services/sorteo.service';
import { SorteoContainer } from "../sorteo-container/sorteo-container";
import { ActivatedRoute, Router } from '@angular/router';
import { SorteoComponent } from "../../global-components/sorteo/sorteo.component";
import { AuthService } from '../../global-services/auth.service';

@Component({
  selector: 'app-ver-sorteos',
  templateUrl: './ver-sorteos.html',
  styleUrl: './ver-sorteos.css',
  imports: [SorteoContainer, SorteoComponent],
})
export class VerSorteos implements OnInit {
  private sorteoService = inject(SorteoService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  filter = signal<string | null>(null);

  // Usar directamente los sorteos del servicio
  sorteos = computed(() => {
    const allSorteos = this.sorteoService.sorteos$();
    const userId = this.authService.getCurrentUser().organizadorId;

    if (this.filter() === 'mis-sorteos') {
      return allSorteos.filter(sorteo => sorteo.organizadorId === userId);
    }

    // Ver todos los sorteos
    return allSorteos.map(sorteo => ({
      ...sorteo,
      fecha: new Date(sorteo.fechaSorteo).toLocaleDateString(),
      numerosDisponibles: sorteo.cantidadNumeros || 0,
      numerosTotales: sorteo.cantidadNumeros || 0
    }));
  });

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.filter.set(params['filter'] || null);
    });

    // Solo cargar si no hay datos en el servicio
    // El servicio se encargará de decidir si hace fetch o usa el caché
    this.sorteoService.getSorteos().subscribe({
      error: (err) => {
        console.error('Error al obtener los sorteos en VerSorteos:', err);
      }
    });
  }

  verDetalles(sorteoId: string) {
    this.router.navigate(['/main/detalles-sorteo', sorteoId]);
  }

  get titulo() {
    return this.filter() === 'mis-sorteos' ? 'Mis Sorteos' : 'Ver Sorteos';
  }
}