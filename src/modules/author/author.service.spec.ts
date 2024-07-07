import { Test, TestingModule } from '@nestjs/testing';
import { AuthorService } from './author.service';
import { PrismaService } from '@app/core/database/prisma.service';
import { ClsService } from 'nestjs-cls';
import { prismaServiceMock } from '@app/common/mocks/prisma-service-mock';
import { ClsServiceMock } from '@app/common/mocks/cls-service-mock';
import { v4 as uuidv4 } from 'uuid';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

describe('AuthorService', () => {
  let service: AuthorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorService,
        { provide: PrismaService, useValue: prismaServiceMock },
        { provide: ClsService, useValue: ClsServiceMock },
      ],
    }).compile();

    service = module.get<AuthorService>(AuthorService);

    // simulate current user object in storage
    ClsServiceMock.get.mockReturnValue({
      id: uuidv4(),
      name: 'current user',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Authors Crud', () => {
    it('should create a Author', async () => {
      const createAuthorDto: CreateAuthorDto = {
        name: 'test Author',
        biography: 'test Author biography',
        birthDate: new Date('1990-07-07T18:18:10.793Z'),
      };
      // mock prisma service create
      prismaServiceMock.author.create.mockResolvedValue({
        id: uuidv4(),
        name: 'test Author',
        biography: 'test Author biography',
        userId: ClsServiceMock.get('user').id,
      });
      const response = await service.create(createAuthorDto);
      expect(response.data.name).toEqual(createAuthorDto.name);
    });

    it('should get a Author', async () => {
      let toFoundId = uuidv4();
      // mock prisma service findUnique
      prismaServiceMock.author.findUnique.mockResolvedValue({
        id: toFoundId,
        name: 'test Author',
        userId: ClsServiceMock.get('user').id,
      });
      const response = await service.findOne(uuidv4());
      expect(response.data.id).toEqual(toFoundId);
    });

    it('should throw NotFoundException if a Author not found', async () => {
      let toFoundId = uuidv4();
      // mock prisma service findUnique
      prismaServiceMock.author.findUnique.mockResolvedValue(null);

      expect(service.findOne(toFoundId)).rejects.toThrow(NotFoundException);
    });

    it('should update a Author if found', async () => {
      let toFoundId = uuidv4();

      const updateAuthorDto: UpdateAuthorDto = {
        name: 'updated Author',
      };

      prismaServiceMock.author.findUnique.mockResolvedValue({
        id: toFoundId,
        name: 'test Author',
        userId: ClsServiceMock.get('user').id,
      });
      // mock prisma service update
      prismaServiceMock.author.update.mockResolvedValue({
        id: uuidv4(),
        name: 'updated Author',
        userId: ClsServiceMock.get('user').id,
      });
      const response = await service.update(toFoundId, updateAuthorDto);
      expect(response.data.name).toEqual(updateAuthorDto.name);
    });

    it('should return UnauthorizedException for update a Author if current user is not the owner', async () => {
      let toFoundId = uuidv4();

      const updateAuthorDto: UpdateAuthorDto = {
        name: 'updated Author',
      };

      prismaServiceMock.author.findUnique.mockResolvedValue({
        id: toFoundId,
        name: 'test Author',
        userId: uuidv4(),
      });
      expect(prismaServiceMock.author.update).not.toHaveBeenCalled();
      expect(service.update(toFoundId, updateAuthorDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return UnauthorizedException for delete a Author if current user is not the owner', async () => {
      let toFoundId = uuidv4();

      prismaServiceMock.author.findUnique.mockResolvedValue({
        id: toFoundId,
        name: 'test Author',
        userId: uuidv4(),
      });
      expect(prismaServiceMock.author.delete).not.toHaveBeenCalled();
      expect(service.remove(toFoundId)).rejects.toThrow(UnauthorizedException);
    });

    it('should delete  Author if current user is the owner', async () => {
      let toFoundId = uuidv4();

      prismaServiceMock.author.findUnique.mockResolvedValue({
        id: toFoundId,
        name: 'test Author',
        userId: ClsServiceMock.get('user').id,
      });
      const response = await service.remove(toFoundId);

      expect(prismaServiceMock.author.delete).toHaveBeenCalled();
      expect(response.data).toEqual({});
    });
  });
});
