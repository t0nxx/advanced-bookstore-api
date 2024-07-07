import { Test, TestingModule } from '@nestjs/testing';
import { GeneresService } from './generes.service';

describe('GeneresService', () => {
  let service: GeneresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneresService],
    }).compile();

    service = module.get<GeneresService>(GeneresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
