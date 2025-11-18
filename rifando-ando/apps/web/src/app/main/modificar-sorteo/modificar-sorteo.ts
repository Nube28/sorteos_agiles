import { Component, inject, signal, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SorteoService } from '../../global-services/sorteo.service';
import { switchMap, tap, firstValueFrom } from 'rxjs'; // Importa firstValueFrom
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, DatePipe } from '@angular/common';
import { SorteoContainer } from "../sorteo-container/sorteo-container";
import { Sorteo } from '@prisma/client';

// --- Imports de CrearSorteo ---
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CloudinaryService } from '../../global-services/cloudinary.service';

// --- Validador de CrearSorteo ---
const ordenFechasValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const inicio = control.get('periodoInicioVenta')?.value;
  const fin = control.get('periodoFinVenta')?.value;
  const sorteo = control.get('fechaSorteo')?.value;

  let errors: any = null;

  if (inicio && fin && new Date(fin) < new Date(inicio)) {
    errors = { ...errors, fechasInvalidasVenta: true };
  }

  if (fin && sorteo && new Date(sorteo) < new Date(fin)) {
    errors = { ...errors, fechasInvalidasSorteo: true };
  }

  return errors;
};

@Component({
  selector: 'app-modificar-sorteo',
  imports: [CommonModule, ReactiveFormsModule, SorteoContainer],
  providers: [DatePipe],
  templateUrl: './modificar-sorteo.html',
  styleUrl: './modificar-sorteo.css',
})
export class ModificarSorteo {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private sorteoService = inject(SorteoService);
  private datePipe = inject(DatePipe);

  private fb = inject(FormBuilder);
  private cloudinaryService = inject(CloudinaryService);
  modificarSorteoForm!: FormGroup;
  isUploading = signal(false);

  previewUrl = signal<string | null>(null);
  minDateStr = new Date().toLocaleDateString('en-CA');
  private selectedFile: File | null = null;


  showSaveSuccess = signal(false);
  showSaveError = signal(false);
  saveErrorMessage = signal('');

  sorteoParaEditar = signal<Sorteo | null>(null);
  isSubmitting = signal(false);

  constructor() {
    this.setupForm();

    this.activatedRoute.paramMap.pipe(
      tap(() => {
        this.sorteoService.sorteo.set(null);
        this.modificarSorteoForm.reset();
        this.previewUrl.set(null);
        this.selectedFile = null;
      }),
      switchMap(params => {
        const sorteoId = +params.get('id')!;
        return this.sorteoService.getSorteoPorId(sorteoId);
      }),
      tap((sorteoCargado) => {
        this.sorteoParaEditar.set(sorteoCargado);


        const sorteoFormateado = {
          ...sorteoCargado,
          periodoInicioVenta: this.datePipe.transform(sorteoCargado.periodoInicioVenta, 'yyyy-MM-dd'),
          periodoFinVenta: this.datePipe.transform(sorteoCargado.periodoFinVenta, 'yyyy-MM-dd'),
          fechaSorteo: this.datePipe.transform(sorteoCargado.fechaSorteo, 'yyyy-MM-dd')
        };

        this.modificarSorteoForm.patchValue(sorteoFormateado);
        this.previewUrl.set(sorteoCargado.urlImg);
      }),
      takeUntilDestroyed()
    ).subscribe();
  }




  private setupForm() {

    this.modificarSorteoForm = this.fb.group({
      nombre: ['', Validators.required],
      premio: ['', Validators.required],
      descripcion: ['', Validators.required],
      cantidadNumeros: ['', Validators.required],
      costo: ['', [Validators.required, Validators.min(0)]],
      urlImg: [''], // Este campo se llenará programáticamente
      periodoInicioVenta: ['',],
      periodoFinVenta: ['',],
      fechaSorteo: ['', ],
      tiempoLimitePago: ['', [ Validators.min(1)]],
    }, {
      validators: ordenFechasValidator
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.modificarSorteoForm.get(fieldName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e) => this.previewUrl.set(e.target?.result as string);
      reader.readAsDataURL(file);
      input.value = '';
    }
  }

  removeImage() {
    this.previewUrl.set(null);
    this.selectedFile = null;
    this.modificarSorteoForm.patchValue({ urlImg: '' });
  }

  async guardarCambios() {
    if (this.isUploading()) return;

    if (this.modificarSorteoForm.invalid) {
      this.modificarSorteoForm.markAllAsTouched();
      return;
    }

    this.isUploading.set(true);
    this.showSaveError.set(false);
    this.showSaveSuccess.set(false);

    let finalImageUrl = this.previewUrl();

    if (this.selectedFile) {
      try {
        finalImageUrl = await firstValueFrom(this.cloudinaryService.uploadImage(this.selectedFile));
      } catch (err) {
        console.error('Error subiendo imagen', err);
        this.saveErrorMessage.set('Error al subir la nueva imagen.');
        this.showSaveError.set(true);
        this.isUploading.set(false);
        return;
      }
    } else if (!this.previewUrl()) {
      finalImageUrl = '';
    }

    const id = this.sorteoParaEditar()!.id;

    const datosActualizados = {
      ...this.sorteoParaEditar(),
      ...this.modificarSorteoForm.value,
      urlImg: finalImageUrl
    };

    this.sorteoService.actualizarSorteo(id, datosActualizados as Sorteo).subscribe({
      next: (sorteoActualizado) => {
        this.sorteoService.sorteo.set(sorteoActualizado);
        this.sorteoParaEditar.set(structuredClone(sorteoActualizado));

        const sorteoFormateado = {
          ...sorteoActualizado,
          periodoInicioVenta: this.datePipe.transform(sorteoActualizado.periodoInicioVenta, 'yyyy-MM-dd'),
          periodoFinVenta: this.datePipe.transform(sorteoActualizado.periodoFinVenta, 'yyyy-MM-dd'),
          fechaSorteo: this.datePipe.transform(sorteoActualizado.fechaSorteo, 'yyyy-MM-dd')
        };
        this.modificarSorteoForm.patchValue(sorteoFormateado);
        this.previewUrl.set(sorteoActualizado.urlImg);
        this.selectedFile = null;

        this.isUploading.set(false);
        this.showSaveSuccess.set(true);
        setTimeout(() => this.showSaveSuccess.set(false), 5000);
      },
      error: (err) => {
        const msg = err.error?.message || err.message || 'Error desconocido';
        this.saveErrorMessage.set(msg);
        this.showSaveError.set(true);
        this.isUploading.set(false);
        setTimeout(() => this.showSaveError.set(false), 5000);
      }
    });
  }
}
