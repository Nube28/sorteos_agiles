import { AuthSection } from "../auth-section/auth-section";
import { CommonModule } from '@angular/common';
import { Component, inject } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../global-services/auth.service";
import { InterfaceService } from "../../global-services/interface.service";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [AuthSection, ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService)
  private interfaceService = inject(InterfaceService)
  private router = inject(Router)

  registerForm: FormGroup;
  errorMessage: string = '';

  constructor() {
    this.registerForm = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ]+(?: [A-Za-zÁÉÍÓÚáéíóúñÑ]+)?$/)
        ]
      ],
      apellidos: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ]+(?: [A-Za-zÁÉÍÓÚáéíóúñÑ]+)?$/)
        ]
      ],
      nombreUsuario: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^\S+$/) // sin espacios
        ]
      ],
      contrasenia: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^\S+$/) // sin espacios
        ]
      ],
      confirmarContrasenia: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\S+$/) // sin espacios
        ]
      ]
    }, {
      validators: [this.passwordMatchValidator],
      updateOn: 'change'
    });
  }

  private passwordMatchValidator(control: AbstractControl) {
    const contrasenia = control.get('contrasenia');
    const confirmarContrasenia = control.get('confirmarContrasenia');

    if (contrasenia && confirmarContrasenia && contrasenia.value !== confirmarContrasenia.value) {
      confirmarContrasenia.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmarContrasenia?.hasError('passwordMismatch') && contrasenia?.value === confirmarContrasenia?.value) {
      confirmarContrasenia.setErrors(null);
    }
    return null;
  }

  // se necesita usar arrow function para mantener el contexto de 'this'
  onSubmit = () => {
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.interfaceService.setLoading(true);

    const { nombre, apellidos, nombreUsuario, contrasenia } = this.registerForm.value;

    this.authService.register(nombreUsuario, contrasenia, nombre, apellidos).subscribe({
      next: (user) => {
        console.log('User registered:', user);

        // Auto-login después del registro
        this.authService.login(nombreUsuario, contrasenia).subscribe({
          next: () => {
            this.interfaceService.setLoading(false);
            this.interfaceService.setEvent('Registro exitoso', `Bienvenido de nuevo ${this.authService.getCurrentUser()?.nombre}`);
            this.interfaceService.toggleAlert(true);
            this.router.navigate(['/main/ver-sorteos']);
          },
          error: (loginError) => {
            this.interfaceService.setLoading(false);
            this.errorMessage = 'Registro exitoso pero el inicio de sesión falló. Por favor, inicie sesión manualmente.';

            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);

            console.error('Auto-login error:', loginError);
          }
        });
      },
      error: (error) => {
        this.interfaceService.setLoading(false);

        if (error.status === 0) {
          this.errorMessage = 'No se puede conectar al servidor. Por favor, verifique que el backend esté en funcionamiento.';
        } else if (error.status === 400) {
          this.errorMessage = 'Este nombre de usuario ya está registrado';
        } else if (error.status === 409) {
          this.errorMessage = 'Este nombre de usuario ya está en uso';
        } else {
          this.errorMessage = 'Error de registro. Por favor, inténtelo de nuevo.';
        }

        console.error('Error de registro:', error);
      }
    });
  }

  hasError(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.registerForm.get(field);

    if (!control || (!control.touched && !control.dirty)) {
      return '';
    }

    if (control.hasError('required')) {
      return this.getFieldLabel(field) + ' es obligatorio';
    }

    if (control.hasError('pattern')) {
      if (field === 'nombre' || field === 'apellidos') {
        return 'Solo se permite un espacio y letras';
      }
      return 'No se permiten espacios';
    }

    if (control.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Debe tener al menos ${minLength} caracteres`;
    }

    if (control.hasError('passwordMismatch')) {
      return 'Las contraseñas no coinciden';
    }

    return '';
  }

  private getFieldLabel(field: string): string {
    const labels: { [key: string]: string } = {
      nombre: 'Nombre',
      apellidos: 'Apellido',
      nombreUsuario: 'Nombre de usuario',
      contrasenia: 'Contraseña',
      confirmarContrasenia: 'Confirmar contraseña'
    };
    return labels[field] || 'Este campo';
  }
}