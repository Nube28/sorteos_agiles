import { PartialType } from '@nestjs/mapped-types';
import { CreateNumeroDto } from './create-numero.dto';

export class UpdateNumeroDto extends PartialType(CreateNumeroDto) { }