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
  @Input() sorteoReceiver!: ISorteo;

  sorteo = computed(() => {
    if (!this.sorteoReceiver) return null;
    const total = this.sorteoReceiver.cantidadNumeros || 0;
    const ocupados = this.sorteoReceiver.boletosOcupados || 0;
    return {
      ...this.sorteoReceiver,
      nombre: this.sorteoReceiver.nombre,
      fecha: new Date(this.sorteoReceiver.fechaSorteo).toLocaleDateString(),
      numerosDisponibles: Math.max(0, total - ocupados),
      numerosTotales: total
    };
  });
}
