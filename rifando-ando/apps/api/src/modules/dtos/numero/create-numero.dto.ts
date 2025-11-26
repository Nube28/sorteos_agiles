import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { INumero } from 'libs/shared';

export class CreateNumeroDto implements INumero {
    @IsNumber()
    posicion!: number;

    @IsDateString()
    fechaApartado!: string;

    @IsNotEmpty()
    sorteoId!: string;

    @IsOptional()
    clienteId?: string;
}