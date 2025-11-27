import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../global-services/auth.service';
import { RolUsuario } from 'libs/shared';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const usuario = authService.getCurrentUser();
  const rolesPermitidos = route.data['rolesPermitidos'] as RolUsuario[];

  // Verificar si el usuario está autenticado
  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  // Verificar si el usuario tiene un rol permitido
  if (!rolesPermitidos.includes(usuario.rol)) {
    router.navigate(['/main/ver-sorteos']);
    return false;
  }

  return true;
};

export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si el usuario no está autenticado, permitir acceso a la ruta pública
  if (!authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/main/dashboard']);
  return false;
};