# RifandoAndo# RifandoAndo
Monorepo para el sistema de sorteos ágiles usando Nx, Angular y Nest.js.

## Estructura del Proyecto

```
rifando-ando/
├── apps/
│   ├── api/          # API REST con Nest.js
│   └── web/          # Aplicación web con Angular
├── libs/
│   └── shared/       # Librería compartida (entidades, DTOs, interfaces)
└── dist/             # Archivos compilados
```

## Inicio Rápido

### Prerequisitos
- Node.js v18 o superior
- pnpm (gestor de paquetes)

### Instalación

```bash
# Habilitar corepack (si no está habilitado)
corepack enable

# Instalar dependencias
pnpm install
```

## Comandos Disponibles

### Desarrollo

```bash
# Servir aplicación web (Angular) en http://localhost:4200
pnpm web

# Servir API (Nest.js) en http://localhost:3000/api
pnpm api

# Servir ambas aplicaciones simultáneamente
pnpm dev
```

### Build de Producción

```bash
# Compilar aplicación web
pnpm nx build web

# Compilar API
pnpm nx build api

# Compilar todo
pnpm nx run-many --target=build --all
```

### Otros Comandos

```bash
# Ver todos los proyectos
pnpm nx show projects

# Ver el grafo de dependencias
pnpm nx graph

# Ejecutar tests
pnpm nx test <project-name>
```

## Uso de la Librería Compartida

La librería `@rifando-ando/shared` contiene código compartido entre el API y la aplicación web.

### Estructura de la Librería

```
libs/shared/src/lib/
├── entities/     # Entidades de base de datos
├── dtos/         # Data Transfer Objects
└── interfaces/   # Interfaces TypeScript
```

## Tecnologías

- **Nx 22**: Herramientas de monorepo
- **Angular 20**: Framework frontend
- **Nest.js 10**: Framework backend
- **TypeScript 5.9**: Lenguaje
- **pnpm 10**: Gestor de paquetes
- **ES Modules**: Sistema de módulos
- **Webpack 5**: Bundler para el API
- **Prisma 6**: ORM

## Configuración Adicional

### Variables de Entorno

Crea archivos `.env` en las siguientes ubicaciones según necesites:

```
apps/api/.env          # Variables del API
apps/web/.env          # Variables de la app web
```