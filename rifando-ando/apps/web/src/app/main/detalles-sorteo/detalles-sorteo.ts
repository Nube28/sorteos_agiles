import { Component, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SorteoContainer } from "../sorteo-container/sorteo-container";
import { ActivatedRoute, Router } from '@angular/router';
import { SorteoService } from '../../global-services/sorteo.service';
import { forkJoin, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NumerosService } from '../../global-services/numero.service';
import { AuthService } from '../../global-services/auth.service';

@Component({
  selector: 'app-detalles-sorteo',
  imports: [SorteoContainer, CommonModule, FormsModule],
  templateUrl: './detalles-sorteo.html',
  styleUrl: './detalles-sorteo.css',
})
export class DetallesSorteo {
  private activatedRoute = inject(ActivatedRoute);
  private numerosService = inject(NumerosService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private sorteoService = inject(SorteoService);

  showApartadoSuccess = signal(false);
  showApartadoError = signal(false);
  apartadoErrorMessage = signal('');

  // Datos del servidor
  sorteo = this.sorteoService.sorteo;
  numerosOcupadosData = this.numerosService.numeros;

  // Lógica de Selección
  numerosSeleccionados = signal<number[]>([]);
  isSubmitting = signal<boolean>(false);
  numerosReservadosExito = signal<number[]>([]);

  constructor() {
    this.activatedRoute.paramMap.pipe(
      tap(() => {
        // Limpiar estado al cambiar de sorteo
        this.sorteoService.sorteo.set(null);
        this.numerosOcupadosData.set([]);
        this.numerosSeleccionados.set([]);
      }),
      switchMap(params => {
        const sorteoId = params.get('id')!;
        return forkJoin({
          sorteo: this.sorteoService.getSorteoPorId(sorteoId),
          numeros: this.numerosService.getNumeros(sorteoId)
        });
      }),
      tap(({ sorteo, numeros }) => {
        console.log('Sorteo cargado:', sorteo);
        console.log('Números ocupados:', numeros);
      }),
      takeUntilDestroyed()
    ).subscribe();
  }

  private setNumerosOcupados = computed(() => {
    const ocupados = new Set<number>();
    const numerosData = this.numerosOcupadosData();

    numerosData.forEach((obj: any) => {
      if (obj.posicion !== null && obj.posicion !== undefined) {
        ocupados.add(Number(obj.posicion));
      }
    });

    return ocupados;
  });

  listaNumerosGenerada = computed(() => {
    const total = this.sorteo()?.cantidadNumeros || 0;
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  totalCalculado = computed(() => {
    const sorteoActual = this.sorteo();
    if (!sorteoActual) return 0;
    return sorteoActual.costo * this.numerosSeleccionados().length;
  });

  esNumeroOcupado(num: number): boolean {
    return this.setNumerosOcupados().has(num);
  }

  esNumeroSeleccionado(num: number): boolean {
    return this.numerosSeleccionados().includes(num);
  }

  toggleNumero(num: number) {
    if (this.esNumeroOcupado(num)) return;

    this.numerosSeleccionados.update(current => {
      if (current.includes(num)) {
        return current.filter(n => n !== num);
      } else {
        return [...current, num];
      }
    });
  }
  volver() {
    this.router.navigate(['/main/ver-sorteos']);
  }

  apartarNumeros() {
    const sorteoActual = this.sorteo();
    const seleccion = this.numerosSeleccionados();
    const clienteId = this.authService.getCurrentUser()?.clienteId; // ID hardcodeado o traído de tu Auth

    if (!sorteoActual?.id || seleccion.length === 0) return;

    this.isSubmitting.set(true);
    this.showApartadoSuccess.set(false);
    this.showApartadoError.set(false);

    this.numerosService.reservarNumeros(sorteoActual.id, seleccion, clienteId).subscribe({
      next: (res: any) => {
        const numerosReservados = res.numeros || seleccion;
        this.numerosReservadosExito.set(numerosReservados);
        this.showApartadoSuccess.set(true);

        this.numerosSeleccionados.set([]);

        const nuevosOcupados = numerosReservados.map((n: number) => ({
          posicion: n,
          sorteoId: sorteoActual.id
        }));
        this.numerosOcupadosData.update(prev => [...prev, ...nuevosOcupados]);

        this.isSubmitting.set(false);

        setTimeout(() => {
          this.showApartadoSuccess.set(false);
        }, 5000);
      },
      error: (err) => {
        const msg = err.error?.message || err.message || 'Error desconocido al apartar números';
        this.apartadoErrorMessage.set(msg);
        this.showApartadoError.set(true);
        this.isSubmitting.set(false);

        setTimeout(() => {
          this.showApartadoError.set(false);
        }, 5000);
      }
    });
  }
}