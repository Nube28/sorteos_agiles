import { IsNumber, IsNotEmpty, IsPositive, IsDateString } from 'class-validator';

export class ReservarCantidadDto {
    @IsNumber()
    @IsNotEmpty()
    sorteoId!: number;

    @IsNumber()
    @IsPositive()
    cantidad!: number;

    @IsDateString()
    fechaApartado!: string;

    @IsNumber()
    @IsPositive()
    clienteId?: number;
}