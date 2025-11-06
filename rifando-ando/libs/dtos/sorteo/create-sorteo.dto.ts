import { IsString, MinLength, MaxLength, IsDateString, IsNumber, IsPositive, IsUrl, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

// Validaciones to do
export class CreateSorteoDto {
  @IsOptional()
  @IsString()
  urlImg?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(500)
  descripcion: string;

  @IsString()
  nombre: string;

  @IsString()
  @MinLength(3)
  @MaxLength(200)
  premio: string;

  @IsDateString()
  periodoInicioVenta: string;

  @IsDateString()
  periodoFinVenta: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  costo: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  cantidadNumeros: number;

  @IsDateString()
  fechaSorteo: string;

  @Type(() => Number)
  @IsNumber()
  tiempoLimitePago: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  organizadorId?: number; // temporal hasta que le metamos JWT
}
