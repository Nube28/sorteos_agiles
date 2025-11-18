import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        redirectTo: 'main/landing-page',
        pathMatch: 'full',
    },
    {
        path: 'main',
        loadComponent: () => import('./main/main').then((m) => m.Main),
        children: [
            {
                path: 'landing-page',
                loadComponent: () => import('./main/landing-page/landing-page').then((m) => m.LandingPage),
            },
            {
                path: 'ver-sorteos',
                loadComponent: () => import('./main/ver-sorteos/ver-sorteos').then((m) => m.VerSorteos),
            },
            {
                path: 'crear-sorteo',
                loadComponent: () => import('./main/crear-sorteo/crear-sorteo').then((m) => m.CrearSorteo),
            },
            {
                path: 'ver-sorteos',
                loadComponent: () => import('./main/ver-sorteos/ver-sorteos').then((m) => m.VerSorteos),
            },
            {
                path: 'detalles-sorteo/:id',
                loadComponent: () => import('./main/detalles-sorteo/detalles-sorteo').then((m) => m.DetallesSorteo)
            },
            {
                path: 'modificar-sorteo/:id',
                loadComponent: () => import('./main/modificar-sorteo/modificar-sorteo').then((m) => m.ModificarSorteo)
            },
            {
                path: '**',
                redirectTo: 'landing-page'
            }
        ]
    }
];
