# Shared Library

Esta librería contiene código compartido entre la aplicación Angular (web) y la aplicación NestJS (api).

## Estructura

```
libs/shared/
├── src/
│   ├── lib/
│   │   ├── entities/     # Entidades de dominio
│   │   ├── dtos/         # Data Transfer Objects
│   │   └── interfaces/   # Interfaces TypeScript
│   └── index.ts          # Punto de entrada principal
├── project.json
├── tsconfig.json
└── tsconfig.lib.json
```

## Uso

### En la API (NestJS)

```typescript
import { CreateUserDto, UserEntity } from '@rifando-ando/shared';
```

### En el Frontend (Angular)

```typescript
import { User, CreateUserDto } from '@rifando-ando/shared';
```

## Agregar nuevas entidades/DTOs

1. Crea el archivo en la carpeta correspondiente (entities, dtos, interfaces)
2. Exporta desde el index.ts de esa carpeta
3. El index.ts principal ya re-exporta todo automáticamente
