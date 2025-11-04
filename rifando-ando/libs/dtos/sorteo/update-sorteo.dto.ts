import { PartialType } from '@nestjs/mapped-types';
import { CreateSorteoDto } from './create-sorteo.dto';

export class UpdateSorteoDto extends PartialType(CreateSorteoDto) {
  nombre?: string;
  descripcion?: string;
  precioNumero?: number;
  cantidadNumeros?: number;
  fechaSorteo?: Date;
  imagenUrl?: string;
  organizadorId?: number;
}
