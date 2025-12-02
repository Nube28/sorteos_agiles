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
import { AuthService } from '../../global-services/auth.service';
import { LucideAngularModule } from "lucide-angular";
import { IconService } from '../../global-services/icon.service';

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

@Component({
  selector: 'app-formulario-sorteo',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
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
  private authService = inject(AuthService);
  private iconService = inject(IconService);

  sorteoForm!: FormGroup;
  previewUrl = signal<string | null>(null);
  minDateStr = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
  todayDate = new Date().toISOString().split('T')[0]; // Para valor por defecto

  private selectedFile: File | null = null;

  // Signals para modo edición
  isEditMode = signal(false);
  sorteoParaEditar = signal<ISorteo | null>(null);
  mostrarConfirmacion = signal(false);

  constructor() {
    this.setupForm();
    this.checkEditMode();
  }

  private checkEditMode() {
    this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        this.isEditMode.set(!!id);

        if (!id) {
          // Modo creación
          this.sorteoForm.patchValue({
            periodoInicioVenta: this.todayDate
          });
          return [null]; // Observable que emite null
        }

        // Modo edición
        this.interfaceService.setLoading(true);
        this.resetearFormulario();
        return this.sorteoService.getSorteoPorId(id);
      }),
      takeUntilDestroyed()
    ).subscribe({
      next: (sorteo) => {
        if (sorteo) {
          this.cargarSorteo(sorteo as ISorteo);
        }
        this.interfaceService.setLoading(false);
      },
      error: (err) => {
        console.error('Error al cargar sorteo:', err);
        this.interfaceService.setLoading(false);
        this.interfaceService.setEvent('Error', 'No se pudo cargar el sorteo');
        this.interfaceService.toggleAlert(true);
        this.router.navigate(['/main/ver-sorteos']);
      }
    });
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
        Validators.maxLength(100)
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
      organizador: this.authService.getCurrentUser().nombreUsuario || '',
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
    if (this.interfaceService.loading()) {
      return;
    }

    if (this.sorteoForm.invalid) {
      this.sorteoForm.markAllAsTouched();
      return;
    }

    this.interfaceService.setLoading(true);

    try {
      // Subir imagen si hay una nueva
      let finalImageUrl = this.previewUrl() || '';
      if (this.selectedFile) {
        finalImageUrl = await firstValueFrom(this.cloudinaryService.uploadImage(this.selectedFile));
      }

      if (this.isEditMode()) {
        // Modo edición - SOLO enviar los campos que pueden actualizarse
        const formValues = this.sorteoForm.value;

        const datosActualizados = {
          nombre: formValues.nombre,
          premio: formValues.premio,
          descripcion: formValues.descripcion,
          cantidadNumeros: Number(formValues.cantidadNumeros),
          costo: Number(formValues.costo),
          urlImg: finalImageUrl,
          periodoInicioVenta: formValues.periodoInicioVenta,
          periodoFinVenta: formValues.periodoFinVenta,
          fechaSorteo: formValues.fechaSorteo,
          tiempoLimitePago: Number(formValues.tiempoLimitePago),
        };

        this.sorteoService.actualizarSorteo(this.sorteoParaEditar()!.id, datosActualizados).subscribe({
          next: (sorteoActualizado) => {
            this.interfaceService.setEvent('Sorteo Modificado', 'Los cambios han sido guardados exitosamente.');
            this.interfaceService.toggleAlert(true);
            this.router.navigate(['main/ver-sorteos']);
            this.interfaceService.setLoading(false);
          },
          error: (err) => {
            console.error('Error al modificar:', err);
            this.interfaceService.setEvent('Error al Modificar Sorteo', err.error?.message || 'Error al guardar');
            this.interfaceService.toggleAlert(true);
            this.interfaceService.setLoading(false);
          }
        });
      } else {
        // Modo creación
        const { organizador, ...restoDelFormulario } = this.sorteoForm.value;
        const sorteoData = {
          ...restoDelFormulario,
          urlImg: finalImageUrl,
          cantidadNumeros: Number(restoDelFormulario.cantidadNumeros),
          costo: Number(restoDelFormulario.costo),
          tiempoLimitePago: Number(restoDelFormulario.tiempoLimitePago),
          organizadorId: this.authService.getCurrentUser().organizadorId,
        };

        this.sorteoService.crearSorteo(sorteoData).subscribe({
          next: (res) => {
            this.limpiarFormulario();
            this.interfaceService.setEvent('Sorteo Creado', 'El sorteo ha sido creado exitosamente.');
            this.interfaceService.toggleAlert(true);
            this.router.navigate(['/main/ver-sorteos']);
            this.interfaceService.setLoading(false);
          },
          error: (err) => {
            console.error('Error al crear:', err);
            this.interfaceService.setEvent('Error al Crear Sorteo', err.error?.message || 'Error al crear');
            this.interfaceService.toggleAlert(true);
            this.interfaceService.setLoading(false);
          }
        });
      }
    } catch (err) {
      console.error('Error al subir imagen:', err);
      this.interfaceService.setEvent('Error al Subir Imagen', 'Error al subir la imagen');
      this.interfaceService.toggleAlert(true);
      this.interfaceService.setLoading(false);
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

  get loading(): boolean {
    return this.interfaceService.loading();
  }

  get currentNombre(): string | undefined {
    const user = this.authService.getCurrentUser();
    return user?.nombre + ' ' + user?.apellidos;
  }

  getIcon(iconName: string) {
    return this.iconService.iconsMap[iconName];
  }

  onSolicitarEliminacion() {
    if (!this.isEditMode() || !this.sorteoParaEditar()) {
      return;
    }
    this.mostrarConfirmacion.set(true);
  }

  cancelarEliminacion() {
    this.mostrarConfirmacion.set(false);
  }

  confirmarEliminacion() {
    this.mostrarConfirmacion.set(false);

    const idSorteo = this.sorteoParaEditar()!.id;
    this.interfaceService.setLoading(true);

    this.sorteoService.eliminarSorteo(idSorteo).subscribe({
      next: () => {
        this.interfaceService.setLoading(false);
        this.interfaceService.setEvent('Sorteo Eliminado', 'El sorteo ha sido eliminado correctamente.');
        this.interfaceService.toggleAlert(true);
        this.router.navigate(['/main/ver-sorteos']);
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        this.interfaceService.setLoading(false);
        this.interfaceService.setEvent('Error', err.error?.message || 'No se pudo eliminar el sorteo.');
        this.interfaceService.toggleAlert(true);
      }
    });
  }
}