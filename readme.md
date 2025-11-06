# Instrucciones de instalación y ejecución

1.  **Instalar dependencias**

    ``` bash
    pnpm install
    ```

2.  **Configurar variables de entorno**

    -   Existe un archivo base llamado `.env.example`\
    -   Crea un nuevo archivo llamado `.env` y coloca tu información
        siguiendo la plantilla de `.env.example`

3.  **Crear base de datos**

    -   Crea la base de datos en tu **pgAdmin4**

4.  **Generar entidades del cliente Prisma**

    ``` bash
    pnpm prisma:generate
    ```

5.  **Aplicar migraciones en tu host local**

    ``` bash
    pnpm prisma:migrate
    ```

6.  **Ejecutar los servicios**

    -   Para correr el **frontend**:

        ``` bash
        pnpm web
        ```

    -   Para correr el **backend**:

        ``` bash
        pnpm api
        ```

------------------------------------------------------------------------

Una vez completados estos pasos, el proyecto estará listo para
ejecutarse correctamente.
