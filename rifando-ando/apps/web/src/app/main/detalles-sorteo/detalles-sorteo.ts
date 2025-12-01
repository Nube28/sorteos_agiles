import { Component, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { SorteoService } from '../../global-services/sorteo.service';
import { forkJoin, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NumerosService } from '../../global-services/numero.service';
import { AuthService } from '../../global-services/auth.service';
import { InterfaceService } from '../../global-services/interface.service';
import { IconService } from '../../global-services/icon.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-detalles-sorteo',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './detalles-sorteo.html',
  styleUrl: './detalles-sorteo.css',
})
export class DetallesSorteo {
  private activatedRoute = inject(ActivatedRoute);
  private numerosService = inject(NumerosService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private interfaceService = inject(InterfaceService);
  private sorteoService = inject(SorteoService);

  private iconService = inject(IconService);

  // Datos del servidor
  sorteo = this.sorteoService.sorteo;
  numerosOcupadosData = this.numerosService.numeros;

  // Lógica de selección
  numerosSeleccionados = signal<number[]>([]);
  numerosReservadosExito = signal<number[]>([]);

  constructor() {
    this.activatedRoute.paramMap.pipe(
      tap(() => {
        // Reset recuerdando buenas prácticas
        this.sorteoService.sorteo.set(null);
        this.numerosService.numeros.set([]);
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

  readonly numerosOcupados = computed(() => {
    return new Set(
      this.numerosOcupadosData().map(n => Number(n.posicion))
    );
  });

  readonly listaNumerosGenerada = computed(() => {
    const total = this.sorteo()?.cantidadNumeros || 0;
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  readonly totalCalculado = computed(() => {
    const sorteo = this.sorteo();
    if (!sorteo) return 0;
    return sorteo.costo * this.numerosSeleccionados().length;
  });

  esNumeroOcupado(num: number) {
    return this.numerosOcupados().has(num);
  }

  esNumeroSeleccionado(num: number) {
    return this.numerosSeleccionados().includes(num);
  }

  toggleNumero(num: number) {
    if (this.esNumeroOcupado(num)) return;

    this.numerosSeleccionados.update(current =>
      current.includes(num)
        ? current.filter(n => n !== num)
        : [...current, num]
    );
  }

  volver() {
    this.router.navigate(['/main/ver-sorteos']);
  }

  apartarNumeros() {
    const sorteoActual = this.sorteo();
    const seleccion = this.numerosSeleccionados();
    const clienteId = this.authService.getCurrentUser()?.clienteId;

    if (!sorteoActual?.id || seleccion.length === 0) {
      this.interfaceService.setEvent('Error', 'No se pudo procesar la reserva.');
      this.interfaceService.toggleAlert(true);
      return;
    }

    if (!clienteId) {
      this.interfaceService.setEvent('Error', 'Solo los cliente pueden apartar números.');
      this.interfaceService.toggleAlert(true);
      return;
    }

    this.numerosService.reservarNumeros(sorteoActual.id, seleccion).subscribe({
      next: (res: any) => {
        const reservados = res.numeros || seleccion;

        this.interfaceService.setEvent('Números apartados correctamente', `Los número(s) ${reservados.join(', ')} han sido apartados con éxito.`);
        this.interfaceService.toggleAlert(true);

        // limpiar selección
        this.numerosSeleccionados.set([]);

        // actualizar ocupados en la UI
        const nuevos = reservados.map((n: number) => ({
          posicion: n,
          sorteoId: sorteoActual.id
        }));

        this.numerosOcupadosData.update(prev => [...prev, ...nuevos]);
      },

      error: err => {
        const msg = err.error?.message || 'Error desconocido al apartar números';
        this.interfaceService.setEvent('Error', msg);
        this.interfaceService.toggleAlert(true);
      }
    });
  }

  get isLoading() {
    return this.interfaceService.loading();
  }

  get esOrganizador() {
    const currentUser = this.authService.getCurrentUser();
    const sorteo = this.sorteo();
    return currentUser?.organizadorId === sorteo?.organizadorId;
  }

  getIcon(iconName: string) {
    return this.iconService.iconsMap[iconName];
  }
}
