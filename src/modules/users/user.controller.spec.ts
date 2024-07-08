import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CoreModule } from '@app/core/core.module';
import { CreateUserDto } from './dto/create-user.dto';
import { mock } from 'jest-mock-extended';
import { LoginUserDto } from './dto/login.dto';

describe('UserController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mock<UsersService>() }],
      imports: [CoreModule],
    }).compile();

    controller = module.get<UsersController>(UsersController);

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call UsersService.register with correct parameters', async () => {
      const createUserDto: CreateUserDto = {
        name: 'test user',
        email: 'test@example.com',
        password: 'password123',
      };

      const registerFunSpy = jest.spyOn(service, 'register');
      controller.register(createUserDto);
      expect(registerFunSpy).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('should call UsersService.login with correct parameters', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const registerFunSpy = jest.spyOn(service, 'login');
      controller.login(loginUserDto);
      expect(registerFunSpy).toHaveBeenCalledWith(loginUserDto);
    });
  });
});
