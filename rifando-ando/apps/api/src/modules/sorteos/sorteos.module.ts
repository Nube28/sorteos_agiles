import { Module } from '@nestjs/common';
import { SorteosService } from './sorteos.service';
import { SorteosController } from './sorteos.controller';
import { OrganizadorService } from './organizador.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [SorteosController],
  providers: [SorteosService, OrganizadorService, PrismaService],
  exports: [SorteosService],
})
export class SorteosModule {}
