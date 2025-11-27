import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthSection } from '../auth-section/auth-section';
import { AuthService } from '../../global-services/auth.service';
import { InterfaceService } from '../../global-services/interface.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthSection, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private interfaceService = inject(InterfaceService);

  loginForm: FormGroup;
  errorMessage: string = '';

  constructor() {
    this.loginForm = this.fb.group({
      nombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
      contrasenia: ['', [Validators.required, Validators.minLength(8)]]
    }, { updateOn: 'change' });
  }

  // Método para verificar si un campo tiene error
  hasError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Método para obtener el mensaje de error específico
  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);

    if (!field || !field.errors) {
      return '';
    }

    if (field.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} es obligatorio`;
    }

    if (field.hasError('minlength')) {
      const minLength = field.errors['minlength'].requiredLength;
      return `Debe tener al menos ${minLength} caracteres`;
    }

    return 'Campo inválido';
  }

  // Método auxiliar para obtener etiquetas legibles
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      nombreUsuario: 'Nombre de usuario',
      contrasenia: 'Contraseña'
    };
    return labels[fieldName] || 'Este campo';
  }

  onSubmit = () => {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.interfaceService.setLoading(true);
    const { nombreUsuario, contrasenia } = this.loginForm.value;

    this.authService.login(nombreUsuario, contrasenia).subscribe({
      next: () => {
        this.interfaceService.setLoading(false);
        this.interfaceService.setEvent('Inicio de sesión exitoso', `Bienvenido de nuevo ${this.authService.getCurrentUser()?.nombre}`);
        this.interfaceService.toggleAlert(true);
        this.router.navigate(['/main/ver-sorteos']);
      },
      error: (error) => {
        this.interfaceService.setLoading(false);

        if (error.status === 0) {
          this.errorMessage = 'No se puede conectar al servidor. Por favor, verifica que el backend esté en funcionamiento.';
        } else if (error.status === 401) {
          this.errorMessage = 'Nombre de usuario o contraseña inválidos';
        } else if (error.status === 404) {
          this.errorMessage = 'Punto final no encontrado. Por favor, verifica la URL de la API.';
        } else {
          this.errorMessage = 'Error de inicio de sesión. Por favor, inténtalo de nuevo.';
        }

        console.error('Login error:', error);
      },
      complete: () => {
        this.interfaceService.setLoading(false);
      }
    });
  }
}