import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CreateUsuarioDto } from '../dtos/usuario/create-usuario.dto';
import { LoginDto } from '../dtos/auth/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}


  async register(createUsuarioDto: CreateUsuarioDto) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUsuarioDto.contrasenia, salt);

    const usuarioParaGuardar = {
      ...createUsuarioDto,
      contrasenia: hashedPassword,
    };

    const nuevoUsuario = await this.usuariosService.create(usuarioParaGuardar);

    const { contrasenia, ...resultado } = nuevoUsuario;
    
    return resultado;
  }

  
  async login(loginDto: LoginDto) {
    const { nombreUsuario, contrasenia } = loginDto;

    const usuario = await this.usuariosService.findOneByUsername(nombreUsuario);

    if (!usuario || !(await bcrypt.compare(contrasenia, usuario.contrasenia))) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = { 
      sub: usuario.id,        
      username: usuario.nombreUsuario, 
      rol: usuario.rol 
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol
      }
    };
  }
}