import { ISorteo } from "../sorteo/sorteo.interface";

export interface INumeroResponse {
    id: string;
    posicion: number;
    fechaApartado: string;
    sorteo: ISorteo;
    pagosId?: string;
}