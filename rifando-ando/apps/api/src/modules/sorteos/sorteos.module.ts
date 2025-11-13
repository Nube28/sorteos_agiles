import { Module } from '@nestjs/common';
import { SorteosService } from './sorteos.service';
import { SorteosController } from './sorteos.controller';
import { OrganizadorService } from './organizador.service';

@Module({
  controllers: [SorteosController],
  providers: [SorteosService, OrganizadorService],
  exports: [SorteosService],
})
export class SorteosModule {}
