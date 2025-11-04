import { Controller,Get} from '@nestjs/common';
import { SorteosService } from './sorteos.service';

@Controller('sorteos')
export class SorteosController {
  constructor(private sorteosService: SorteosService) {}

  @Get()
  public async getSorteos(){
    return this.sorteosService.getSorteos();
  }
}
