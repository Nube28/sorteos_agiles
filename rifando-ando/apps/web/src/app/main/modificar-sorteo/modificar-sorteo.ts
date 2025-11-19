import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SorteoService } from '../../global-services/sorteo.service';
import { switchMap, tap, firstValueFrom } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, DatePipe } from '@angular/common';
import { SorteoContainer } from "../sorteo-container/sorteo-container";
import { Sorteo } from '@prisma/client';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CloudinaryService } from '../../global-services/cloudinary.service';
import { InterfaceService } from '../../global-services/interface.service';

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
  private sorteoService = inject(SorteoService);
  private datePipe = inject(DatePipe);
  private fb = inject(FormBuilder);
  private cloudinaryService = inject(CloudinaryService);
  private interfaceService = inject(InterfaceService);
  private router = inject(Router)

  modificarSorteoForm!: FormGroup;
  isUploading = signal(false);
  previewUrl = signal<string | null>(null);
  minDateStr = new Date().toLocaleDateString('en-CA');
  private selectedFile: File | null = null;

  sorteoParaEditar = signal<Sorteo | null>(null);

  constructor() {
    this.setupForm();

    this.activatedRoute.paramMap.pipe(
      tap(() => this.resetearFormulario()),
      switchMap(params => this.sorteoService.getSorteoPorId(+params.get('id')!)),
      tap(sorteo => this.cargarSorteo(sorteo)),
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
      urlImg: [''],
      periodoInicioVenta: ['', Validators.required],
      periodoFinVenta: ['', Validators.required],
      fechaSorteo: ['', Validators.required],
      tiempoLimitePago: ['', [Validators.required, Validators.min(1)]],
    }, { validators: ordenFechasValidator });
  }

  private resetearFormulario() {
    this.modificarSorteoForm.reset();
    this.previewUrl.set(null);
    this.selectedFile = null;
  }

  private cargarSorteo(sorteo: Sorteo) {
    this.sorteoParaEditar.set(sorteo);

    this.modificarSorteoForm.patchValue({
      ...sorteo,
      periodoInicioVenta: this.datePipe.transform(sorteo.periodoInicioVenta, 'yyyy-MM-dd'),
      periodoFinVenta: this.datePipe.transform(sorteo.periodoFinVenta, 'yyyy-MM-dd'),
      fechaSorteo: this.datePipe.transform(sorteo.fechaSorteo, 'yyyy-MM-dd')
    });

    this.previewUrl.set(sorteo.urlImg);
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.modificarSorteoForm.get(fieldName);
    return !!(control && control.invalid && (control.touched || control.dirty));
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
    this.modificarSorteoForm.patchValue({ urlImg: '' });
  }

  async guardarCambios() {
    if (this.modificarSorteoForm.invalid) {
      this.modificarSorteoForm.markAllAsTouched();
      return;
    }

    this.isUploading.set(true);

    try {
      // Subir imagen si hay una nueva
      let finalImageUrl = this.previewUrl() || '';
      if (this.selectedFile) {
        finalImageUrl = await firstValueFrom(this.cloudinaryService.uploadImage(this.selectedFile));
      }

      const datosActualizados = {
        ...this.sorteoParaEditar()!,
        ...this.modificarSorteoForm.value,
        urlImg: finalImageUrl
      };

      this.sorteoService.actualizarSorteo(this.sorteoParaEditar()!.id, datosActualizados as Sorteo).subscribe({
        next: (sorteoActualizado) => {
          this.cargarSorteo(sorteoActualizado);
          this.selectedFile = null;
          this.isUploading.set(false);
          this.interfaceService.setEvent('Sorteo Modificado', 'Los cambios han sido guardados exitosamente.');
          this.interfaceService.toggleAlert(true);
          this.router.navigate(['main/ver-sorteos']);
        },
        error: (err) => {
          this.interfaceService.setEvent('Error al Modificar Sorteo', err.error?.message || 'Error al guardar');
          this.interfaceService.toggleAlert(true);
          this.isUploading.set(false);
        }
      });
    } catch (err) {
      this.interfaceService.setEvent('Error al Subir Imagen', 'Error al subir la imagen');
      this.interfaceService.toggleAlert(true);
      this.isUploading.set(false);
    }
  }
}