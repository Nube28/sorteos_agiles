import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ISorteo } from 'libs/shared';

@Component({
  selector: 'app-sorteo',
  imports: [CommonModule],
  templateUrl: './sorteo.component.html',
  styleUrl: './sorteo.component.css',
})
export class SorteoComponent {
  private router = inject(Router);

  @Input() sorteoReceiver!: ISorteo;

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
