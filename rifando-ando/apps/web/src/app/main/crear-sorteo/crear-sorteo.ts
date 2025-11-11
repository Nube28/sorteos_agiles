import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SorteoService } from '../../global-services/sorteo.service';
import { SorteoContainer } from "../sorteo-container/sorteo-container";

@Component({
  selector: 'app-crear-sorteo',
  imports: [ReactiveFormsModule, SorteoContainer],
  templateUrl: './crear-sorteo.html',
  styleUrl: './crear-sorteo.css',
})
export class CrearSorteo {
  private fb = inject(FormBuilder);
  private sorteoService = inject(SorteoService);
  crearSorteoForm!: FormGroup;
  showSuccessAlert = signal(false);
  constructor() {
    this.setupForm();
  }

  private setupForm() {
    this.crearSorteoForm = this.fb.group({
      // organizador: [''],
      nombre: ['', Validators.required],
      premio: ['', Validators.required],
      descripcion: ['', Validators.required],
      cantidadNumeros: [''],
      costo: ['', [Validators.required, Validators.min(0)]],
      urlImg: [''],
      periodoInicioVenta: ['', Validators.required],
      periodoFinVenta: ['', Validators.required],
      fechaSorteo: ['', Validators.required],
      tiempoLimitePago: ['', [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit() {
    if (this.crearSorteoForm.valid) {
      const sorteoData = this.crearSorteoForm.value;
      this.sorteoService.crearSorteo(sorteoData).subscribe({
        next: (response) => {
          console.log('Sorteo creado exitosamente:', response);
          this.crearSorteoForm.reset();
          this.showSuccessAlert.set(true);
          setTimeout(() => {
            this.showSuccessAlert.set(false);
          }, 3000);
        },
        error: (err) => {
          console.error('Error al crear sorteo:', err);
        }
      });
    } else {
      // campos como touched para mostrar errores
      Object.keys(this.crearSorteoForm.controls).forEach(key => {
        this.crearSorteoForm.get(key)?.markAsTouched();
      });

      // errores específicos de cada campo
      console.log('Formulario inválido');
      Object.keys(this.crearSorteoForm.controls).forEach(key => {
        const control = this.crearSorteoForm.get(key);
        if (control?.invalid) {
          console.log(`${key}:`, control.errors);
        }
      });
    }
  }
}
