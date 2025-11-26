import { IsString, IsEnum, MinLength, IsNotEmpty } from 'class-validator';
import { RolUsuario } from 'libs/shared/usuario/usuario.interface';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsString()
  @IsNotEmpty()
  nombreUsuario: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contrasenia: string;

  @IsEnum(RolUsuario, { message: 'El rol debe ser CLIENTE u ORGANIZADOR' })
  rol: RolUsuario;
}