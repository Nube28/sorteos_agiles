import { IsNotEmpty, IsNumber, IsPositive, IsDateString } from 'class-validator';

export class CreateNumeroDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  posicion: number;

  @IsDateString()
  fechaApartado: Date;

}