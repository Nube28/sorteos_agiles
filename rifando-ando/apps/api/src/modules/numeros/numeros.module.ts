import { Module } from '@nestjs/common';
import { NumeroService } from './numeros.service';
import { NumeroController } from './numeros.controller';
import { NumerosSchedulerService } from './numeros-scheduler.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [NumeroController],
  providers: [NumeroService, NumerosSchedulerService, PrismaService],
  exports: [NumeroService],
})
export class NumerosModule { }
