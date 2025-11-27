import { IsString, MinLength, MaxLength, IsDateString, IsNumber, IsPositive, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ISorteo } from 'libs/shared/sorteo/sorteo.interface';

export class CreateSorteoDto implements ISorteo {
  @IsOptional()
  @IsString()
  urlImg?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(500)
  descripcion!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  nombre!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(200)
  premio!: string;

  @IsDateString()
  periodoInicioVenta!: string;

  @IsDateString()
  periodoFinVenta!: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  costo!: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  cantidadNumeros!: number;

  @IsDateString()
  fechaSorteo!: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  numerosDisponibles?: number;

  @Type(() => Number)
  @IsNumber()
  tiempoLimitePago!: number;

  // @IsOptional()
  // @IsString()
  // nombreOrganizador: string;
}
