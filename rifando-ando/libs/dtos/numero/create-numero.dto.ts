import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreateNumeroDto {
    @IsNumber() 
    @IsNotEmpty()
    posicion: number;

    @IsDateString() 
    @IsNotEmpty()
    fechaApartado: string;

    @IsNumber()
    @IsNotEmpty()
    sorteoId: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    clienteId?: number;
}