import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsuariosService } from '../usuarios/usuarios.service';
import { RolUsuario } from 'libs/shared';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Rol } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usuarios: UsuariosService,
    private jwt: JwtService,
  ) { }

  async register(registerDto: RegisterDto) {
    const { nombreUsuario, contrasenia, nombre, apellidos, rol } = registerDto;

    // Verificar si existe
    const existingUser = await this.usuarios.findByNombreUsuario(nombreUsuario);
    if (existingUser) {
      throw new ConflictException('El nombre de usuario ya está en uso');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(contrasenia, 10);

    // Crear usuario (ahora también crea Cliente/Organizador)
    const usuario = await this.usuarios.create(
      nombreUsuario,
      hashedPassword,
      nombre,
      apellidos,
      rol || Rol.CLIENTE
    );

    // Retornar sin contraseña
    return this.usuarios.toSafeUser(usuario);
  }

  async validateUser(nombreUsuario: string, password: string) {
    const user = await this.usuarios.findByNombreUsuario(nombreUsuario);

    if (!user) return null;

    const match = await bcrypt.compare(password, user.contrasenia);

    if (!match) return null;

    return user;
  }

  async login(nombreUsuario: string, password: string) {
    const user = await this.validateUser(nombreUsuario, password);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');

    }

    const payload = { sub: user.id, nombreUsuario: user.nombreUsuario };
    const token = await this.jwt.signAsync(payload);
    const expiresIn = Number(process.env.JWT_EXPIRES_IN ?? 86400);

    return { accessToken: token, expiresIn };
  }
}
