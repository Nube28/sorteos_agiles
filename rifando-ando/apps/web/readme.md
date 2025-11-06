# Frontend - Web

## Ejecución del frontend

Para correr el frontend utiliza el siguiente comando:

``` bash
pnpm web
```

------------------------------------------------------------------------

## Creacion de componentes

Para crear un nuevo componente en el proyecto Angular (usando Nx),
ejecuta el siguiente comando:

``` bash
npx nx g @nx/angular:component apps/web/src/app/main/nombre-componente/nombre-componente
```

Asegúrate de reemplazar `nombre-componente` por el nombre real del
componente que deseas generar

------------------------------------------------------------------------

## ¿Como hacer que un componente se muestre?

Para que un componente se muestre tienes que importarlo directamente
en la app (Hola soy el gomez y creo que es una mala practica, probablemente
se tenga que pasar a main y main ya va para app, pero aun me falta investigar)

en el app.ts tienes que importar tu componente ej:

``` typescript
import { CrearSorteo } from './main/crear-sorteo/crear-sorteo';
```

luego en `@component` en el apartado de import agregar al array el nombre del componente

``` typescript
imports: [RouterOutlet, CrearSorteo],
```

y ya puedes usarlo en el app.html como si fuera etiqueta normal

``` html
<app-crear-sorteo></app-crear-sorteo>
```
