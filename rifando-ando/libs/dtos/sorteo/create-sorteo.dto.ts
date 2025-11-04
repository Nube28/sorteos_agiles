import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateSorteoDto {
  urlImg: string;
  descripcion: string;
  premio: string;
  periodoInicioVenta: Date;
  periodoFinVenta: Date;
  costo: number;
  fechaSorteo: Date;
  tiempoLimitePago: Date;
  // organizadorId se pasa por separado desde el userId
}
