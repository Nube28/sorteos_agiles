import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: 'main',
        loadComponent: () => import('./main/main').then((m) => m.Main),
        children: [
            {
                path: 'crear-sorteo',
                loadComponent: () => import('./main/crear-sorteo/crear-sorteo').then((m) => m.CrearSorteo),
            }
        ]
    }
];
