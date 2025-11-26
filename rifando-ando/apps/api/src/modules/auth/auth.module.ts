import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuariosModule } from '../usuarios/usuarios.module'; 

@Module({
  imports: [
    UsuariosModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.register({
      // ¡OJO! En producción, esto DEBE venir de una variable de entorno (.env)
      // Ejemplo: process.env.JWT_SECRET
      secret: process.env.JWT_SECRET, 
      signOptions: { 
        expiresIn: '24h' 
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule, PassportModule]
})
export class AuthModule {}