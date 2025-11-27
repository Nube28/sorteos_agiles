import { Route } from '@angular/router';
import { authGuard, publicGuard } from './guards/auth.guard';
import { RolUsuario } from 'libs/shared';

export const appRoutes: Route[] = [
    {
        path: '',
        redirectTo: 'main/landing-page',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        loadComponent: () => import('./auth/auth').then((m) => m.Auth),
        canActivate: [publicGuard],
        children: [
            {
                path: 'login',
                loadComponent: () => import('./auth/login/login').then((m) => m.Login),
            },
            {
                path: 'register',
                loadComponent: () => import('./auth/register/register').then((m) => m.Register),
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: '**',
                redirectTo: 'login'
            }
        ],
    },
    {
        path: 'main',
        loadComponent: () => import('./main/main').then((m) => m.Main),
        children: [
            {
                path: '',
                redirectTo: 'landing-page',
                pathMatch: 'full'
            },
            {
                path: 'landing-page',
                loadComponent: () => import('./main/landing-page/landing-page').then((m) => m.LandingPage),
                canActivate: [publicGuard],
            },
            {
                path: 'ver-sorteos',
                loadComponent: () => import('./main/ver-sorteos/ver-sorteos').then((m) => m.VerSorteos),
                canActivate: [authGuard],
                data: { rolesPermitidos: [RolUsuario.CLIENTE, RolUsuario.ORGANIZADOR] }
            },
            {
                path: 'crear-sorteo',
                loadComponent: () => import('./main/formulario-sorteo/formulario-sorteo').then((m) => m.FormularioSorteo),
                canActivate: [authGuard],
                data: { rolesPermitidos: [RolUsuario.ORGANIZADOR] }
            },
            {
                path: 'detalles-sorteo/:id',
                loadComponent: () => import('./main/detalles-sorteo/detalles-sorteo').then((m) => m.DetallesSorteo),
                canActivate: [authGuard],
                data: { rolesPermitidos: [RolUsuario.CLIENTE, RolUsuario.ORGANIZADOR] }
            },
            {
                path: 'modificar-sorteo/:id',
                loadComponent: () => import('./main/formulario-sorteo/formulario-sorteo').then((m) => m.FormularioSorteo),
                canActivate: [authGuard],
                data: { rolesPermitidos: [RolUsuario.ORGANIZADOR] }
            },
            {
                path: '**',
                redirectTo: 'ver-sorteos'
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'main/landing-page',
    }
];