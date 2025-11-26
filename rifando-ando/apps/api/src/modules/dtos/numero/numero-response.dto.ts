import { INumero } from "libs/shared";

export class NumeroResponseDto implements INumero {
    posicion!: number;
    fechaApartado!: string;
    sorteoId!: string;
    clienteId?: string;
}