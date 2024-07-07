import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/core/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { v4 as uuidv4 } from 'uuid';
import { prismaServiceMock } from '@app/common/mocks/prisma-service-mock';
import { JwtServiceMock } from '@app/common/mocks/jwt-service-mock';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { LoginUserDto } from './dto/login.dto';

describe('UserService Unit Test', () => {
  let service: UsersService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: JwtService, useValue: JwtServiceMock },
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto: CreateUserDto = {
      name: 'user0',
      email: 'user0@test.com',
      password: 'test123456',
    };

    it('should register a new user and return it with access token', async () => {
      // mock prisma service create
      prismaServiceMock.user.create.mockResolvedValue({
        id: uuidv4(),
        name: 'user0',
        email: 'user0@test.com',
        createdAt: '2024-07-07T18:18:10.793Z',
        updatedAt: '2024-07-07T18:18:10.793Z',
      });
      const response = await service.register(registerDto);
      expect(response.data.email).toEqual(registerDto.email);
      expect(response.meta).toHaveProperty('access_token');
    });

    it('should throw an error if user already exists', async () => {
      // mock prisma service findUnique
      prismaServiceMock.user.findUnique.mockResolvedValue({
        email: registerDto.email,
      });
      expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(prismaServiceMock.user.create).not.toHaveBeenCalled();
    });
  });

  describe('Login', () => {
    const loginDto: LoginUserDto = {
      email: 'user0@test.com',
      password: '123456',
    };

    it('should login with correct credentials', async () => {
      // mock prisma service create
      prismaServiceMock.user.findUnique.mockResolvedValue({
        email: loginDto.email,
        // pass : '123456',
        password:
          '$2b$10$66puH55yO18dYCWJc2g9ReLzF0TVaPrwQay0mmm7GPOURTLHpCXRe',
      });
      const response = await service.login(loginDto);
      expect(response.data.email).toEqual(loginDto.email);
      expect(response.meta).toHaveProperty('access_token');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      // mock prisma service findUnique
      prismaServiceMock.user.findUnique.mockResolvedValue(null);
      expect(service.login(loginDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if password is incorrect', async () => {
      // mock prisma service findUnique
      prismaServiceMock.user.findUnique.mockResolvedValue({
        email: loginDto.email,
        // pass : '123456',
        password:
          '$2b$10$66puH55yO18dYCWJc2g9ReLzF0TVaPrwQay0mmm7GPOURTLHpCXRe',
      });
      expect(
        service.login({ email: loginDto.email, password: 'not correct pass ' }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
