# Instrucciones de instalación y ejecución

1.  **Instalar dependencias**

    ``` bash
    pnpm install
    ```

2.  **Configurar variables de entorno**

    -   Crea un nuevo archivo llamado `.env` en la raíz del proyecto (dentro de rifando-ando)
    -   Coloca tu información siguiendo la plantilla de `.env.example`

3.  **Base de datos**

    -   Crea la base de datos de postgreSQL siguiendo los siguientes pasos:

    3.1.  **Generar entidades del cliente Prisma**

        ``` bash
        pnpm prisma:generate
        ```

    3.2.  **Aplicar migraciones en tu host local**

        ``` bash
        pnpm prisma:migrate
        ```

    3.3.  **Visualizar el contenido de la base de datos desde el navegador (opcional)**

        ``` bash
        pnpm prisma:studio
        ```

4.  **Ejecutar los servicios**

    -   Para correr el **frontend**:

        ``` bash
        pnpm web
        ```

    -   Para correr el **backend**:

        ``` bash
        pnpm api
        ```

5.  **Visualizar los enpoints usando Swagger**

    -   Después de correr el **backend**, ir a la ruta:
    -   http://localhost:3000/api

------------------------------------------------------------------------

Una vez completados estos pasos, el proyecto estará listo para
ejecutarse correctamente.
