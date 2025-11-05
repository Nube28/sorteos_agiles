import { IsString, MinLength, MaxLength, IsDateString, IsNumber, IsPositive, IsUrl, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

// Validaciones to do
export class CreateSorteoDto {
  @IsUrl()
  @IsString()
  urlImg: string;

  @IsString()
  @MinLength(10)
  @MaxLength(500)
  descripcion: string;

  @IsString()
  @MinLength(3)
  @MaxLength(200)
  premio: string;

  @IsDateString()
  periodoInicioVenta: string;

  @IsDateString()
  periodoFinVenta: string;

  @IsNumber()
  @IsPositive()
  costo: number;

  @IsDateString()
  fechaSorteo: string;

  @IsDateString()
  tiempoLimitePago: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  organizadorId?: number; // temporal hasta que le metamos JWT
}
