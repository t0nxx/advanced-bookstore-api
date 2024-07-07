import { Test, TestingModule } from '@nestjs/testing';
import { GeneresController } from './generes.controller';
import { GeneresService } from './generes.service';

describe('GeneresController', () => {
  let controller: GeneresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneresController],
      providers: [GeneresService],
    }).compile();

    controller = module.get<GeneresController>(GeneresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
