import { Component, computed, inject, Input } from '@angular/core';
import { Router } from '@angular/router';

// what the helly
import type { Sorteo } from '@prisma/client';

@Component({
  selector: 'app-sorteo',
  imports: [],
  templateUrl: './sorteo.component.html',
  styleUrl: './sorteo.component.css',
})
export class SorteoComponent {
  private router = inject(Router);

  @Input() sorteoReceiver!: Sorteo;

  sorteo = computed(() => {
    if (!this.sorteoReceiver) return null;

    return {
      ...this.sorteoReceiver,
      nombre: this.sorteoReceiver.nombre,
      fecha: new Date(this.sorteoReceiver.fechaSorteo).toLocaleDateString(),
      numerosDisponibles: this.sorteoReceiver.cantidadNumeros || 0,
      numerosTotales: this.sorteoReceiver.cantidadNumeros || 0
    };
  });

  verDetalles(sorteoId: Number) {
    this.router.navigate(['/main/detalles-sorteo', sorteoId]);
  }
}
