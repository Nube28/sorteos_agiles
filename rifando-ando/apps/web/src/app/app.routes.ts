import { Route } from '@angular/router';
import { authGuard, publicGuard } from './guards/auth.guard';

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
        ],
    },
    {
        path: 'main',
        loadComponent: () => import('./main/main').then((m) => m.Main),
        children: [
            {
                path: 'landing-page',
                loadComponent: () => import('./main/landing-page/landing-page').then((m) => m.LandingPage),
                canActivate: [publicGuard],
            },
            {
                path: 'ver-sorteos',
                loadComponent: () => import('./main/ver-sorteos/ver-sorteos').then((m) => m.VerSorteos),
                canActivate: [authGuard],
            },
            {
                path: 'crear-sorteo',
                loadComponent: () => import('./main/formulario-sorteo/formulario-sorteo').then((m) => m.FormularioSorteo),
                canActivate: [authGuard],
            },
            {
                path: 'ver-sorteos',
                loadComponent: () => import('./main/ver-sorteos/ver-sorteos').then((m) => m.VerSorteos),
                canActivate: [authGuard],
            },
            {
                path: 'detalles-sorteo/:id',
                loadComponent: () => import('./main/detalles-sorteo/detalles-sorteo').then((m) => m.DetallesSorteo),
                canActivate: [authGuard],
            },
            {
                path: 'modificar-sorteo/:id',
                loadComponent: () => import('./main/formulario-sorteo/formulario-sorteo').then((m) => m.FormularioSorteo),
                canActivate: [authGuard],
            },
        ]
    }, {
        path: '**',
        redirectTo: 'landing-page',
    }
];
