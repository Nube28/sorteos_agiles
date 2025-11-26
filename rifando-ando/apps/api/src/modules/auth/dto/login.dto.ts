import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'usuario123' })
  @IsString()
  nombreUsuario!: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  contrasenia!: string;
}
