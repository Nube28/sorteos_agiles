import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { switchMap, tap, firstValueFrom } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SorteoService } from '../../global-services/sorteo.service';
import { CloudinaryService } from '../../global-services/cloudinary.service';
import { InterfaceService } from '../../global-services/interface.service';
import { SorteoContainer } from "../sorteo-container/sorteo-container";
import { ISorteo } from 'libs/shared';

const ordenFechasValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const inicio = control.get('periodoInicioVenta')?.value;
  const fin = control.get('periodoFinVenta')?.value;
  const sorteo = control.get('fechaSorteo')?.value;

  let errors: any = null;

  if (inicio && fin && new Date(fin) <= new Date(inicio)) {
    errors = { ...errors, fechasInvalidasVenta: true };
  }

  if (fin && sorteo && new Date(sorteo) <= new Date(fin)) {
    errors = { ...errors, fechasInvalidasSorteo: true };
  }

  return errors;
};

// Validador personalizado para fecha mínima (hoy) - SOLO para edición
const fechaMinimaValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(control.value);
  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return { fechaPasada: true };
  }

  return null;
};

@Component({
  selector: 'app-formulario-sorteo',
  imports: [CommonModule, ReactiveFormsModule, SorteoContainer],
  providers: [DatePipe],
  templateUrl: './formulario-sorteo.html',
  styleUrl: './formulario-sorteo.css',
})
export class FormularioSorteo {
  private activatedRoute = inject(ActivatedRoute);
  private sorteoService = inject(SorteoService);
  private datePipe = inject(DatePipe);
  private fb = inject(FormBuilder);
  private cloudinaryService = inject(CloudinaryService);
  private interfaceService = inject(InterfaceService);
  private router = inject(Router);

  sorteoForm!: FormGroup;
  isUploading = signal(false);
  previewUrl = signal<string | null>(null);
  minDateStr = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
  todayDate = new Date().toISOString().split('T')[0]; // Para valor por defecto

  private selectedFile: File | null = null;

  // Signals para modo edición
  isEditMode = signal(false);
  sorteoParaEditar = signal<ISorteo | null>(null);
  isLoading = signal(false);

  constructor() {
    this.setupForm();
    this.checkEditMode();
  }

  private checkEditMode() {
    this.activatedRoute.paramMap.pipe(
      tap(() => {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        this.isEditMode.set(!!id);

        if (!id) {
          this.isLoading.set(false);
          // En modo creación, establecer fecha de inicio por defecto
          this.sorteoForm.patchValue({
            periodoInicioVenta: this.todayDate
          });
        } else {
          this.isLoading.set(true);
          this.resetearFormulario();
        }
      }),
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          return this.sorteoService.getSorteoPorId(id);
        }
        return [];
      }),
      tap(sorteo => {
        if (sorteo) {
          this.cargarSorteo(sorteo as ISorteo);
          this.isLoading.set(false);
        }
      }),
      takeUntilDestroyed()
    ).subscribe();
  }

  private setupForm() {
    const soloEnteros = /^[0-9]+$/;

    this.sorteoForm = this.fb.group({
      organizador: [''],
      nombre: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      premio: ['', [
        Validators.required,
        Validators.maxLength(100) // Agregamos el límite aquí
      ]],
      descripcion: ['', [
        Validators.required,
        Validators.maxLength(1000)
      ]],
      cantidadNumeros: ['', [
        Validators.required,
        Validators.min(1),
        Validators.pattern(soloEnteros)
      ]],
      costo: ['', [
        Validators.required,
        Validators.min(1)
      ]],
      urlImg: [''],
      periodoInicioVenta: ['', Validators.required],
      periodoFinVenta: ['', Validators.required],
      fechaSorteo: ['', Validators.required],
      tiempoLimitePago: ['', [
        Validators.required,
        Validators.min(1),
        Validators.pattern(soloEnteros)
      ]],
    }, { validators: ordenFechasValidator });
  }

  private resetearFormulario() {
    this.sorteoForm.reset();
    this.previewUrl.set(null);
    this.selectedFile = null;
  }

  private cargarSorteo(sorteo: ISorteo) {
    this.sorteoParaEditar.set(sorteo);

    // Remover validación de organizador en modo edición
    this.sorteoForm.get('organizador')?.clearValidators();
    this.sorteoForm.get('organizador')?.updateValueAndValidity();

    this.sorteoForm.patchValue({
      organizador: sorteo.nombreOrganizador || '',
      nombre: sorteo.nombre,
      premio: sorteo.premio,
      descripcion: sorteo.descripcion,
      cantidadNumeros: sorteo.cantidadNumeros,
      costo: sorteo.costo,
      urlImg: sorteo.urlImg || '',
      periodoInicioVenta: this.datePipe.transform(sorteo.periodoInicioVenta, 'yyyy-MM-dd'),
      periodoFinVenta: this.datePipe.transform(sorteo.periodoFinVenta, 'yyyy-MM-dd'),
      fechaSorteo: this.datePipe.transform(sorteo.fechaSorteo, 'yyyy-MM-dd'),
      tiempoLimitePago: sorteo.tiempoLimitePago,
    });

    this.previewUrl.set(sorteo.urlImg || '');

    // Marcar todos los campos como touched para que no aparezcan errores inicialmente
    this.sorteoForm.markAllAsTouched();
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.sorteoForm.get(fieldName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  hasFechaPasadaError(fieldName: string): boolean {
    const control = this.sorteoForm.get(fieldName);
    return !!(control && control.hasError('fechaPasada') && (control.touched || control.dirty));
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = (e) => this.previewUrl.set(e.target?.result as string);
      reader.readAsDataURL(this.selectedFile);

      input.value = '';
    }
  }

  removeImage() {
    this.previewUrl.set(null);
    this.selectedFile = null;
    this.sorteoForm.patchValue({ urlImg: '' });
  }

  async onSubmit() {
    if (this.isUploading()) {
      return;
    }

    if (this.sorteoForm.invalid) {
      this.sorteoForm.markAllAsTouched();
      return;
    }

    this.isUploading.set(true);

    try {
      // Subir imagen si hay una nueva
      let finalImageUrl = this.previewUrl() || '';
      if (this.selectedFile) {
        finalImageUrl = await firstValueFrom(this.cloudinaryService.uploadImage(this.selectedFile));
      }

      if (this.isEditMode()) {
        // Modo edición - SOLO enviar los campos que pueden actualizarse
        const { organizador, ...restoDelFormulario } = this.sorteoForm.value;

        const datosActualizados = {
          nombre: restoDelFormulario.nombre,
          premio: restoDelFormulario.premio,
          descripcion: restoDelFormulario.descripcion,
          cantidadNumeros: Number(restoDelFormulario.cantidadNumeros),
          costo: Number(restoDelFormulario.costo),
          urlImg: finalImageUrl,
          periodoInicioVenta: restoDelFormulario.periodoInicioVenta,
          periodoFinVenta: restoDelFormulario.periodoFinVenta,
          fechaSorteo: restoDelFormulario.fechaSorteo,
          tiempoLimitePago: Number(restoDelFormulario.tiempoLimitePago),
        };

        this.sorteoService.actualizarSorteo(this.sorteoParaEditar()!.id, datosActualizados).subscribe({
          next: (sorteoActualizado) => {
            this.interfaceService.setEvent('Sorteo Modificado', 'Los cambios han sido guardados exitosamente.');
            this.interfaceService.toggleAlert(true);
            this.router.navigate(['main/ver-sorteos']);
            this.isUploading.set(false);
          },
          error: (err) => {
            console.error('Error al modificar:', err);
            this.interfaceService.setEvent('Error al Modificar Sorteo', err.error?.message || 'Error al guardar');
            this.interfaceService.toggleAlert(true);
            this.isUploading.set(false);
          }
        });
      } else {
        // Modo creación
        const { organizador, ...restoDelFormulario } = this.sorteoForm.value;
        const sorteoData = {
          ...restoDelFormulario,
          urlImg: finalImageUrl,
          nombreOrganizador: organizador,
          cantidadNumeros: Number(restoDelFormulario.cantidadNumeros),
          costo: Number(restoDelFormulario.costo),
          tiempoLimitePago: Number(restoDelFormulario.tiempoLimitePago),
        };

        this.sorteoService.crearSorteo(sorteoData, organizador).subscribe({
          next: (res) => {
            this.limpiarFormulario();
            this.interfaceService.setEvent('Sorteo Creado', 'El sorteo ha sido creado exitosamente.');
            this.interfaceService.toggleAlert(true);
            this.router.navigate(['/main/ver-sorteos']);
            this.isUploading.set(false);
          },
          error: (err) => {
            console.error('Error al crear:', err);
            this.interfaceService.setEvent('Error al Crear Sorteo', err.error?.message || 'Error al crear');
            this.interfaceService.toggleAlert(true);
            this.isUploading.set(false);
          }
        });
      }
    } catch (err) {
      console.error('Error al subir imagen:', err);
      this.interfaceService.setEvent('Error al Subir Imagen', 'Error al subir la imagen');
      this.interfaceService.toggleAlert(true);
      this.isUploading.set(false);
    }
  }

  onCancelar() {
    this.limpiarFormulario();
    this.router.navigate(['/main/ver-sorteos']);
  }

  limpiarFormulario() {
    this.sorteoForm.reset();
    this.removeImage();
    // Restaurar fecha por defecto después de limpiar
    if (!this.isEditMode()) {
      this.sorteoForm.patchValue({
        periodoInicioVenta: this.todayDate
      });
    }
  }

  get titulo(): string {
    if (this.isEditMode() && this.sorteoParaEditar()) {
      return `Modificar Sorteo: ${this.sorteoParaEditar()!.nombre}`;
    }
    return 'Crear Sorteo';
  }
}