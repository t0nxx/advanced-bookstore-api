import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { CoreModule } from '@app/core/core.module';
import { mock } from 'jest-mock-extended';
import { v4 as uuidv4 } from 'uuid';
import { CreateBookDto } from './dto/create-book.dto';

describe('BookController', () => {
  let controller: BookController;

  let service: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [{ provide: BookService, useValue: mock<BookService>() }],
      imports: [CoreModule],
    }).compile();

    controller = module.get<BookController>(BookController);
    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call BookService.findAll when call findAll', async () => {
    const spy = jest.spyOn(service, 'findAll');
    controller.findAll({ page: 1, limit: 10 });
    expect(spy).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });

  it('should call BookService.findOne when call findOne', async () => {
    let id = uuidv4();
    const spy = jest.spyOn(service, 'findOne');
    controller.findOne(id);
    expect(spy).toHaveBeenCalledWith(id);
  });

  it('should call BookService.create when call create', async () => {
    const createBookDto: CreateBookDto = {
      title: 'test book',
      description: 'test description',
      authorId: uuidv4(),
      genreId: uuidv4(),
      publicationDate: new Date(),
    };
    const spy = jest.spyOn(service, 'create');
    controller.create(createBookDto);
    expect(spy).toHaveBeenCalledWith(createBookDto);
  });

  it('should call BookService.update when call update', async () => {
    let id = uuidv4();
    const spy = jest.spyOn(service, 'update');
    controller.update(id, {});
    expect(spy).toHaveBeenCalledWith(id, {});
  });

  it('should call BookService.remove when call remove', async () => {
    let id = uuidv4();
    const spy = jest.spyOn(service, 'remove');
    controller.remove(id);
    expect(spy).toHaveBeenCalledWith(id);
  });
});
