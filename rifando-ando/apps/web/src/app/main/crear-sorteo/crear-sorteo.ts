import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SorteoService } from '../../global-services/sorteo.service';
import { SorteoContainer } from "../sorteo-container/sorteo-container";
import { CloudinaryService } from '../../global-services/cloudinary.service';

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

  constructor() {
    this.setupForm();
  }

  private setupForm() {
    this.crearSorteoForm = this.fb.group({
      // organizador: [''],
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
      this.isUploading.set(true);

      const reader = new FileReader();
      reader.onload = (e) => this.previewUrl.set(e.target?.result as string);
      reader.readAsDataURL(file);

      // Cloudinary
      this.cloudinaryService.uploadImage(file).subscribe({
        next: (url) => {
          console.log('Imagen subida, URL:', url);
          this.crearSorteoForm.patchValue({ urlImg: url });
          this.isUploading.set(false);
        },
        error: (err) => {
          console.error('Error subiendo imagen', err);
          this.isUploading.set(false);
        }
      });

      input.value = '';
    }
  }
  
  removeImage() {
      this.previewUrl.set(null);
      this.crearSorteoForm.patchValue({ urlImg: '' });
  }

  onSubmit() {
    if (this.isUploading()) {
      return; 
    }
    
    if (this.crearSorteoForm.valid) {
      console.log('Datos a enviar:', this.crearSorteoForm.value);

      const sorteoData = this.crearSorteoForm.value;
      this.sorteoService.crearSorteo(sorteoData).subscribe({
        next: (response) => {
          this.crearSorteoForm.reset();
          this.showSuccessAlert.set(true);
          setTimeout(() => this.showSuccessAlert.set(false), 3000);
        },
        error: (err) => console.error(err)
      });
    } else {
      this.crearSorteoForm.markAllAsTouched(); // Esto marca TODO como 'touched' para disparar las validaciones visuales
    }
  }
}
