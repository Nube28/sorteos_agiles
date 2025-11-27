import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SorteosModule } from '../modules/sorteos/sorteos.module';
import { NumerosModule } from '../modules/numeros/numeros.module';
import { AuthModule } from '../modules/auth/auth.module';
import { UsuariosModule } from '../modules/usuarios/usuarios.module';
import { LoggerMiddleware } from '../logger-middleware';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    SorteosModule,
    NumerosModule,
    AuthModule,
    UsuariosModule,
    ScheduleModule.forRoot(),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
