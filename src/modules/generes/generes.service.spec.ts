import { Test, TestingModule } from '@nestjs/testing';
import { GeneresService } from './generes.service';
import { PrismaService } from '@app/core/database/prisma.service';
import { ClsService } from 'nestjs-cls';
import { prismaServiceMock } from '@app/common/mocks/prisma-service-mock';
import { ClsServiceMock } from '@app/common/mocks/cls-service-mock';
import { v4 as uuidv4 } from 'uuid';
import { CreateGenereDto } from './dto/create-genere.dto';
import { UpdateGenereDto } from './dto/update-genere.dto';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

describe('GeneresService', () => {
  let service: GeneresService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeneresService,
        { provide: PrismaService, useValue: prismaServiceMock },
        { provide: ClsService, useValue: ClsServiceMock },
      ],
    }).compile();

    service = module.get<GeneresService>(GeneresService);

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

  describe('Generes Crud', () => {
    it('should create a genere', async () => {
      const createGenereDto: CreateGenereDto = {
        name: 'test genere',
      };
      // mock prisma service create
      prismaServiceMock.genre.create.mockResolvedValue({
        id: uuidv4(),
        name: 'test genere',
        userId: ClsServiceMock.get('user').id,
      });
      const response = await service.create(createGenereDto);
      expect(response.data.name).toEqual(createGenereDto.name);
    });

    it('should get a genere', async () => {
      let toFoundId = uuidv4();
      // mock prisma service findUnique
      prismaServiceMock.genre.findUnique.mockResolvedValue({
        id: toFoundId,
        name: 'test genere',
        userId: ClsServiceMock.get('user').id,
      });
      const response = await service.findOne(uuidv4());
      expect(response.data.id).toEqual(toFoundId);
    });

    it('should throw NotFoundException if a genere not found', async () => {
      let toFoundId = uuidv4();
      // mock prisma service findUnique
      prismaServiceMock.genre.findUnique.mockResolvedValue(null);

      expect(service.findOne(toFoundId)).rejects.toThrow(NotFoundException);
    });

    it('should update a genere if found', async () => {
      let toFoundId = uuidv4();

      const updateGenereDto: UpdateGenereDto = {
        name: 'updated genere',
      };

      prismaServiceMock.genre.findUnique.mockResolvedValue({
        id: toFoundId,
        name: 'test genere',
        userId: ClsServiceMock.get('user').id,
      });
      // mock prisma service update
      prismaServiceMock.genre.update.mockResolvedValue({
        id: uuidv4(),
        name: 'updated genere',
        userId: ClsServiceMock.get('user').id,
      });
      const response = await service.update(toFoundId, updateGenereDto);
      expect(response.data.name).toEqual(updateGenereDto.name);
    });

    it('should return UnauthorizedException for update a genere if current user is not the owner', async () => {
      let toFoundId = uuidv4();

      const updateGenereDto: UpdateGenereDto = {
        name: 'updated genere',
      };

      prismaServiceMock.genre.findUnique.mockResolvedValue({
        id: toFoundId,
        name: 'test genere',
        userId: uuidv4(),
      });
      expect(prismaServiceMock.genre.update).not.toHaveBeenCalled();
      expect(service.update(toFoundId, updateGenereDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return UnauthorizedException for delete a genere if current user is not the owner', async () => {
      let toFoundId = uuidv4();

      prismaServiceMock.genre.findUnique.mockResolvedValue({
        id: toFoundId,
        name: 'test genere',
        userId: uuidv4(),
      });
      expect(prismaServiceMock.genre.delete).not.toHaveBeenCalled();
      expect(service.remove(toFoundId)).rejects.toThrow(UnauthorizedException);
    });

    it('should delete  genere if current user is the owner', async () => {
      let toFoundId = uuidv4();

      prismaServiceMock.genre.findUnique.mockResolvedValue({
        id: toFoundId,
        name: 'test genere',
        userId: ClsServiceMock.get('user').id,
      });
      const response = await service.remove(toFoundId);

      expect(prismaServiceMock.genre.delete).toHaveBeenCalled();
      expect(response.data).toEqual({});
    });
  });
});
