import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { PrismaService } from '@app/core/database/prisma.service';
import { ClsService } from 'nestjs-cls';
import { prismaServiceMock } from '@app/common/mocks/prisma-service-mock';
import { ClsServiceMock } from '@app/common/mocks/cls-service-mock';
import { v4 as uuidv4 } from 'uuid';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
describe('BookService', () => {
  let service: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        EventEmitter2,
        { provide: PrismaService, useValue: prismaServiceMock },
        { provide: ClsService, useValue: ClsServiceMock },
      ],
    }).compile();

    service = module.get<BookService>(BookService);

    // simulate current user object in storage
    ClsServiceMock.get.mockReturnValue({
      id: uuidv4(),
      title: 'current user',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Books Crud', () => {
    let authorId = uuidv4();
    let genreId = uuidv4();
    it('should create a Book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'test Book',
        description: 'test description',
        publicationDate: new Date(),
        authorId: authorId,
        genreId: genreId,
      };
      // mock prisma service find author
      prismaServiceMock.author.findUnique.mockResolvedValue({
        id: authorId,
        name: 'test author',
        userId: ClsServiceMock.get('user').id,
      });
      // mock prisma service find genere
      prismaServiceMock.genre.findUnique.mockResolvedValue({
        id: genreId,
        name: 'test genere',
        userId: ClsServiceMock.get('user').id,
      });
      // mock prisma service create
      prismaServiceMock.book.create.mockResolvedValue({
        id: uuidv4(),
        title: 'test Book',
        description: 'test description',
        publicationDate: new Date(),
      });
      const response = await service.create(createBookDto);
      expect(response.data.title).toEqual(createBookDto.title);
    });

    it('should not create a Book if current user is not the owner of author or genere ', async () => {
      const createBookDto: CreateBookDto = {
        title: 'test Book',
        description: 'test description',
        publicationDate: new Date(),
        authorId: authorId,
        genreId: genreId,
      };
      // mock prisma service create
      prismaServiceMock.book.create.mockResolvedValue({
        id: uuidv4(),
        title: 'test Book',
        description: 'test description',
        publicationDate: new Date(),
      });
      expect(prismaServiceMock.book.create).not.toHaveBeenCalled();
      expect(service.create(createBookDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should get a Book', async () => {
      let toFoundId = uuidv4();
      // mock prisma service findUnique
      prismaServiceMock.book.findUnique.mockResolvedValue({
        id: toFoundId,
        title: 'test Book',
        description: 'test description',
        publicationDate: new Date(),
      });
      const response = await service.findOne(toFoundId);
      expect(response.data.id).toEqual(toFoundId);
    });

    it('should get all Book', async () => {
      let allbooks = [
        [
          {
            id: uuidv4(),
            title: 'test Book',
            description: 'test description',
            publicationDate: new Date(),
          },
          {
            id: uuidv4(),
            title: 'test Book 2',
            description: 'test description 2',
            publicationDate: new Date(),
          },
        ],
      ];
      // mock prisma service findMany
      prismaServiceMock.book.findMany.mockResolvedValue(allbooks);
      const response = await service.findAll({ limit: 10, page: 1 });
      expect(response.data).toEqual(allbooks);
    });

    it('should get all Books by seaerched query', async () => {
      let query = 'test';
      let allbooks = [
        [
          {
            id: uuidv4(),
            title: 'test Book',
            description: 'test description',
            publicationDate: new Date(),
          },
          {
            id: uuidv4(),
            title: 'test Book 2',
            description: 'test description 2',
            publicationDate: new Date(),
          },
        ],
      ];
      // mock prisma service findMany
      prismaServiceMock.book.findMany.mockResolvedValue(allbooks);
      const response = await service.search({ limit: 10, page: 1 }, query);
      expect(response.data).toEqual(allbooks);
    });

    it('should get empty Books by seaerched query if not found', async () => {
      let query = 'XXXXXXXXXXXXXXXXXXXXXXXXX';
      let allbooks = [
        [
          {
            id: uuidv4(),
            title: 'test Book',
            description: 'test description',
            publicationDate: new Date(),
          },
          {
            id: uuidv4(),
            title: 'test Book 2',
            description: 'test description 2',
            publicationDate: new Date(),
          },
        ],
      ];
      // mock prisma service findMany
      prismaServiceMock.book.findMany.mockResolvedValue([]);
      const response = await service.search({ limit: 10, page: 1 }, query);
      expect(response.data).toEqual([]);
    });
    it('should throw NotFoundException if a Book not found', async () => {
      let toFoundId = uuidv4();
      // mock prisma service findUnique
      prismaServiceMock.book.findUnique.mockResolvedValue(null);

      expect(service.findOne(toFoundId)).rejects.toThrow(NotFoundException);
    });

    it('should update a Book if found', async () => {
      let toFoundId = uuidv4();

      const updateBookDto: UpdateBookDto = {
        title: 'updated Book',
      };

      prismaServiceMock.book.findUnique.mockResolvedValue({
        id: toFoundId,
        title: 'test Book',
        userId: ClsServiceMock.get('user').id,
      });
      // mock prisma service update
      prismaServiceMock.book.update.mockResolvedValue({
        id: uuidv4(),
        title: 'updated Book',
        userId: ClsServiceMock.get('user').id,
      });
      const response = await service.update(toFoundId, updateBookDto);
      expect(response.data.title).toEqual(updateBookDto.title);
    });

    it('should return UnauthorizedException for update a Book if current user is not the owner', async () => {
      let toFoundId = uuidv4();

      const updateBookDto: UpdateBookDto = {
        title: 'updated Book',
      };

      prismaServiceMock.book.findUnique.mockResolvedValue({
        id: toFoundId,
        title: 'test Book',
        userId: uuidv4(),
      });
      expect(prismaServiceMock.book.update).not.toHaveBeenCalled();
      expect(service.update(toFoundId, updateBookDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return UnauthorizedException for delete a Book if current user is not the owner', async () => {
      let toFoundId = uuidv4();

      prismaServiceMock.book.findUnique.mockResolvedValue({
        id: toFoundId,
        title: 'test Book',
        userId: uuidv4(),
      });
      expect(prismaServiceMock.book.delete).not.toHaveBeenCalled();
      expect(service.remove(toFoundId)).rejects.toThrow(UnauthorizedException);
    });

    it('should delete  Book if current user is the owner', async () => {
      let toFoundId = uuidv4();

      prismaServiceMock.book.findUnique.mockResolvedValue({
        id: toFoundId,
        title: 'test Book',
        userId: ClsServiceMock.get('user').id,
      });
      const response = await service.remove(toFoundId);

      expect(prismaServiceMock.book.delete).toHaveBeenCalled();
      expect(response.data).toEqual({});
    });
  });
});
