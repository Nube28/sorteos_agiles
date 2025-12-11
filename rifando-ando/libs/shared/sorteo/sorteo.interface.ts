export interface ISorteo {
    id?: string;
    urlImg?: string;
    descripcion: string;
    nombre: string;
    premio: string;
    periodoInicioVenta: string;
    periodoFinVenta: string;
    costo: number;
    cantidadNumeros: number;
    fechaSorteo: string;
    tiempoLimitePago: number;
    organizadorId: string;
    // nombreOrganizador: string;
}
