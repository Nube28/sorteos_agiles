export interface ISorteo {
    id?: number;
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
    nombreOrganizador: string;
}
