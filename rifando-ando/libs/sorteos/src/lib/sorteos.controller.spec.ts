import { Test } from '@nestjs/testing';
import { SorteosController } from './sorteos.controller';
import { SorteosService } from './sorteos.service';

describe('SorteosController', () => {
  let controller: SorteosController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SorteosService],
      controllers: [SorteosController],
    }).compile();

    controller = module.get(SorteosController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
