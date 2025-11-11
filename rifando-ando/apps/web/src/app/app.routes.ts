import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        redirectTo: 'main/ver-sorteos', 
        pathMatch: 'full'    
    },
    {
        path: 'main',
        loadComponent: () => import('./main/main').then((m) => m.Main),
        children: [
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
                path: '**',
                redirectTo: 'ver-sorteos'
            }
        ]
    }
];
