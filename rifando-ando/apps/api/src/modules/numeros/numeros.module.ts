import { Module } from '@nestjs/common';
import { NumeroService } from './numeros.service';
import { NumeroController } from './numeros.controller';

@Module({
  controllers: [NumeroController],
  providers: [NumeroService],
  exports: [NumeroService],
})
export class NumerosModule {}
