import { IsNumber, IsOptional } from 'class-validator';

export class UpdateNumeroDto {
  clienteId?: number;
  pagosId?: number;
}