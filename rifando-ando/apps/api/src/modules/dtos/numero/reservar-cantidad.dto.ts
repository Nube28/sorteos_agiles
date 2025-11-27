import { IsNumber, IsNotEmpty, IsPositive, IsDateString, IsArray, ArrayMinSize, IsInt } from 'class-validator';

export class ReservarNumerosDto {
    @IsNotEmpty()
    sorteoId!: string;

    @IsArray({ message: 'Los números deben ser enviados como un arreglo' })
    @ArrayMinSize(1, { message: 'Debes seleccionar al menos un número' })
    @IsInt({ each: true, message: 'Cada número debe ser un entero' }) // Valida cada elemento del array
    @IsPositive({ each: true, message: 'Cada número debe ser positivo' })
    numeros!: number[];

    @IsDateString()
    fechaApartado!: string;

    // cambiar, está harcodeado con el opcional
    clienteId?: string;
}