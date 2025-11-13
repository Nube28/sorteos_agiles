import { Module } from '@nestjs/common';
import { NumeroService } from './numeros.service';
import { NumeroController } from './numeros.controller';
import { NumerosSchedulerService } from './numeros-scheduler.service';

@Module({
  controllers: [NumeroController],
  providers: [NumeroService, NumerosSchedulerService],
  exports: [NumeroService],
})
export class NumerosModule { }
