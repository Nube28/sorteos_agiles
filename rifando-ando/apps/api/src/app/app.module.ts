import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {SorteosController,SorteosService} from '@rifando-ando/sorteos'

@Module({
  imports: [

  ],
  controllers: [AppController,SorteosController],
  providers: [AppService,SorteosService],
})
export class AppModule {}
