import { ApiProperty } from '@nestjs/swagger';
import { Rol } from '@prisma/client';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  contrasenia!: string;

  @ApiProperty({ example: 'username123' })
  @IsString()
  nombreUsuario!: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  nombre!: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  apellidos!: string;

  @ApiProperty({ example: 'ORGANIZADOR', enum: Rol })
  @IsEnum(Rol)
  rol!: Rol;
}
