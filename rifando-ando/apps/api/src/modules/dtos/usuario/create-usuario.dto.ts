import { IsString, IsEnum, MinLength, IsNotEmpty } from 'class-validator';
// Asegúrate de importar esto desde tu librería compartida
// Si tu path alias es distinto, ajústalo (ej: @nx-monorepo/shared)
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