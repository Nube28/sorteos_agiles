import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SorteoService } from '../../global-services/sorteo.service';
import { SorteoContainer } from "../sorteo-container/sorteo-container";
import { CloudinaryService } from '../../global-services/cloudinary.service';
import { firstValueFrom } from 'rxjs';


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
  selector: 'app-crear-sorteo',
  imports: [ReactiveFormsModule, SorteoContainer],
  templateUrl: './crear-sorteo.html',
  styleUrl: './crear-sorteo.css',
})
export class CrearSorteo {
  private fb = inject(FormBuilder);
  private sorteoService = inject(SorteoService);
  private cloudinaryService = inject(CloudinaryService);

  crearSorteoForm!: FormGroup;
  showSuccessAlert = signal(false);
  isUploading = signal(false);
  previewUrl = signal<string | null>(null);

  minDateStr = new Date().toLocaleDateString('en-CA');

  private selectedFile: File | null = null;

  constructor() {
    this.setupForm();
  }

  private setupForm() {
    this.crearSorteoForm = this.fb.group({
      organizador: ['', Validators.required],
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
    }, {
      validators: ordenFechasValidator
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.crearSorteoForm.get(fieldName);
    // Retorna true si es inválido Y el usuario ya interactuó con él
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
    this.crearSorteoForm.patchValue({ urlImg: '' });
  }

  async onSubmit() {
    if (this.isUploading()) {
      return;
    }

    if (this.crearSorteoForm.invalid) {
      this.crearSorteoForm.markAllAsTouched();
      return;
    }

    this.isUploading.set(true);

    let finalImageUrl = '';

    if (this.selectedFile) {
      try {
        // 5. SUBIR A CLOUDINARY AHORA
        finalImageUrl = await firstValueFrom(this.cloudinaryService.uploadImage(this.selectedFile));
        console.log('Imagen subida, URL:', finalImageUrl);

      } catch (err) {
        console.error('Error subiendo imagen', err);
        this.isUploading.set(false); // Si falla la imagen, detenemos todo
        // Aquí podrías mostrar una alerta de error de imagen
        return;
      }
    }
    const { organizador, ...restoDelFormulario } = this.crearSorteoForm.value;

    const sorteoData = { ...restoDelFormulario, urlImg: finalImageUrl };
    const nombreOrganizadorVariable = organizador;

    console.log('Datos a enviar a la API:', sorteoData);

    this.sorteoService.crearSorteo(sorteoData, nombreOrganizadorVariable).subscribe({
      next: (response) => {
        this.crearSorteoForm.reset();
        this.removeImage();
        this.showSuccessAlert.set(true);
        this.isUploading.set(false);
        setTimeout(() => this.showSuccessAlert.set(false), 3000);
      },
      error: (err) => {
        console.error(err);
        this.isUploading.set(false);
      }
    });
  }
}
