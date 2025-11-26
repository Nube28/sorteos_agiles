import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TokenDto } from './dto/token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsuariosService } from '../usuarios/usuarios.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private usuarios: UsuariosService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description: 'Crea una nueva cuenta de usuario con nombre de usuario y contraseña',
  })
  @ApiCreatedResponse({
    description: 'Usuario registrado exitosamente',
    type: TokenDto,
  })
  @ApiBadRequestResponse({ description: 'Nombre de usuario ya existe o datos inválidos' })
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autentica a un usuario y devuelve un token JWT de acceso',
  })
  @ApiOkResponse({
    description: 'Inicio de sesión exitoso',
    type: TokenDto,
  })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas' })
  async login(@Body() dto: LoginDto): Promise<TokenDto> {
    return this.auth.login(dto.nombreUsuario, dto.contrasenia);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Obtener usuario actual',
    description: 'Devuelve el perfil del usuario autenticado',
  })
  @ApiOkResponse({ description: 'Perfil de usuario recuperado exitosamente' })
  @ApiUnauthorizedResponse({ description: 'No autenticado o usuario no encontrado' })
  async me(@Req() req: Request & { user: { userId: string; email: string } }) {
    const user = await this.usuarios.findById(req.user.userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return this.usuarios.toSafeUser(user);
  }
}
