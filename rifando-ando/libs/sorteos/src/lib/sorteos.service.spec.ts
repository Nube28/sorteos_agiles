import { Test } from '@nestjs/testing';
import { SorteosService } from './sorteos.service';

describe('SorteosService', () => {
  let service: SorteosService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SorteosService],
    }).compile();

    service = module.get(SorteosService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
