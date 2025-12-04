import { Component, inject, OnInit } from '@angular/core';
import { SorteoContainer } from "../sorteo-container/sorteo-container";
import { NumerosService } from '../../global-services/numero.service';
import { InterfaceService } from '../../global-services/interface.service';
import { Alert } from '../../global-components/alert/alert';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-consultar-numeros',
  imports: [SorteoContainer, DatePipe, Alert],
  templateUrl: './consultar-numeros.html',
  styleUrl: './consultar-numeros.css',
})
export class ConsultarNumeros implements OnInit {
  private numerosService = inject(NumerosService);
  private interfaceService = inject(InterfaceService);

  selectedNumerosIds = new Set<string>();

  numerosApartados$ = this.numerosService.numerosApartados$;

  ngOnInit(): void {
    this.cargarNumeros();
  }

  cargarNumeros() {
    this.numerosService.getNumerosUsuarioId().subscribe({
      error: (err) => console.error('Error al cargar:', err)
    });
  }

  toggleSelection(id: string) {
    if (this.selectedNumerosIds.has(id)) {
      this.selectedNumerosIds.delete(id);
    } else {
      this.selectedNumerosIds.add(id);
    }
  }

  isSelected(id: string): boolean {
    return this.selectedNumerosIds.has(id);
  }

  clearSelection() {
    this.selectedNumerosIds.clear();
  }

  liberarNumerosSeleccionados() {
    if (this.selectedNumerosIds.size === 0) return;

    const idsParaLiberar = Array.from(this.selectedNumerosIds);

    this.numerosService.liberarNumeros(idsParaLiberar).subscribe({
      next: () => {
        this.selectedNumerosIds.clear();
        
        this.interfaceService.toggleAlert(true);
        this.interfaceService.setEvent(
          'Éxito', 
          'Boletos liberados exitosamente'
        );
      },
      error: (err) => {
        console.error(err);
        this.interfaceService.toggleAlert(true);
        this.interfaceService.setEvent(
          'Error', 
          'Hubo un error al intentar liberar los números.'
        );
      }
    });
  }

  getNumerosSinPagar(grupo: { sorteo: any; numeros: any[] }): number {
    return grupo.numeros.filter(n => n.pagosId == null).length;
  }

  hasNumerosSinPagar(grupo: { sorteo: any; numeros: any[] }): boolean {
    return grupo.numeros.some(n => n.pagosId == null);
  }
}