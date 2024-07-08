import { Test, TestingModule } from '@nestjs/testing';
import { GeneresController } from './generes.controller';
import { GeneresService } from './generes.service';
import { CreateGenereDto } from './dto/create-genere.dto';
import { CoreModule } from '@app/core/core.module';
import { mock } from 'jest-mock-extended';
import { v4 as uuidv4 } from 'uuid';

describe('GeneresController', () => {
  let controller: GeneresController;
  let service: GeneresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneresController],
      providers: [
        { provide: GeneresService, useValue: mock<GeneresService>() },
      ],
      imports: [CoreModule],
    }).compile();

    controller = module.get<GeneresController>(GeneresController);
    service = module.get<GeneresService>(GeneresService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call GeneresService.findAll when call findAll', async () => {
    const spy = jest.spyOn(service, 'findAll');
    controller.findAll({ page: 1, limit: 10 });
    expect(spy).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });

  it('should call GeneresService.findOne when call findOne', async () => {
    let id = uuidv4();
    const spy = jest.spyOn(service, 'findOne');
    controller.findOne(id);
    expect(spy).toHaveBeenCalledWith(id);
  });

  it('should call GeneresService.create when call create', async () => {
    const createGenereDto: CreateGenereDto = {
      name: 'test genere',
    };
    const spy = jest.spyOn(service, 'create');
    controller.create(createGenereDto);
    expect(spy).toHaveBeenCalledWith(createGenereDto);
  });

  it('should call GeneresService.update when call update', async () => {
    let id = uuidv4();
    const spy = jest.spyOn(service, 'update');
    controller.update(id, {});
    expect(spy).toHaveBeenCalledWith(id, {});
  });

  it('should call GeneresService.remove when call remove', async () => {
    let id = uuidv4();
    const spy = jest.spyOn(service, 'remove');
    controller.remove(id);
    expect(spy).toHaveBeenCalledWith(id);
  });
});
