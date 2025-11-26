import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  nombreUsuario: string;

  @IsString()
  @IsNotEmpty()
  contrasenia: string;
}