import { Test, TestingModule } from '@nestjs/testing';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { CoreModule } from '@app/core/core.module';
import { mock } from 'jest-mock-extended';
import { v4 as uuidv4 } from 'uuid';
import { CreateAuthorDto } from './dto/create-author.dto';

describe('AuthorController', () => {
  let controller: AuthorController;

  let service: AuthorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [{ provide: AuthorService, useValue: mock<AuthorService>() }],
      imports: [CoreModule],
    }).compile();

    controller = module.get<AuthorController>(AuthorController);
    service = module.get<AuthorService>(AuthorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call AuthorService.findAll when call findAll', async () => {
    const spy = jest.spyOn(service, 'findAll');
    controller.findAll({ page: 1, limit: 10 });
    expect(spy).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });

  it('should call AuthorService.findOne when call findOne', async () => {
    let id = uuidv4();
    const spy = jest.spyOn(service, 'findOne');
    controller.findOne(id);
    expect(spy).toHaveBeenCalledWith(id);
  });

  it('should call AuthorService.create when call create', async () => {
    const createAuthorDto: CreateAuthorDto = {
      name: 'test Author',
      biography: 'test Author biography',
      birthDate: new Date('1990-07-07T18:18:10.793Z'),
    };
    const spy = jest.spyOn(service, 'create');
    controller.create(createAuthorDto);
    expect(spy).toHaveBeenCalledWith(createAuthorDto);
  });

  it('should call AuthorService.update when call update', async () => {
    let id = uuidv4();
    const spy = jest.spyOn(service, 'update');
    controller.update(id, {});
    expect(spy).toHaveBeenCalledWith(id, {});
  });

  it('should call AuthorService.remove when call remove', async () => {
    let id = uuidv4();
    const spy = jest.spyOn(service, 'remove');
    controller.remove(id);
    expect(spy).toHaveBeenCalledWith(id);
  });
});
