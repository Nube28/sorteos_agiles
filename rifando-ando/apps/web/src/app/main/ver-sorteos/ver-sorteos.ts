import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
  private router = inject(Router)
  private activatedRoute = inject(ActivatedRoute);

  private rawSorteos = signal<any[]>([]);
  filter = signal<string | null>(null);

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.filter.set(params['filter'] || null);
    });

    this.sorteoService.getSorteos().subscribe({
      next: (sorteos) => {
        this.rawSorteos.set(sorteos);
      },
      error: (err) => {
        console.error('Error al obtener los sorteos en VerSorteos:', err);
      }
    });
  }

  sorteos = computed(() => {
    const allSorteos = this.rawSorteos();
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

  verDetalles(sorteoId: string) {
    this.router.navigate(['/main/detalles-sorteo', sorteoId]);
  }

  get titulo() {
    return this.filter() === 'mis-sorteos' ? 'Mis Sorteos' : 'Ver Sorteos';
  }
}

