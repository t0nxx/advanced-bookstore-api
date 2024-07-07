import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClsService } from 'nestjs-cls';
import { AuthGuard } from './auth-guard.guard';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { CoreModule } from '@app/core/core.module';
import { IAppConfig } from '@app/core/config';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let configService: ConfigService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CoreModule],
      providers: [
        {
          provide: ClsService,
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
          },
        },
        ConfigService,
        AuthGuard,
      ],
    }).compile();

    jwtService = moduleRef.get<JwtService>(JwtService);
    configService = moduleRef.get<ConfigService>(ConfigService);
    guard = moduleRef.get<AuthGuard>(AuthGuard);
  });

  it('should allow access with a valid token', async () => {
    let validToken = await jwtService.signAsync(
      { userId: 1 },
      {
        secret: configService.get<IAppConfig['auth']>('auth').JWT_SECRET,
        expiresIn: configService.get<IAppConfig['auth']>('auth').JWT_EXPIRES_IN,
      },
    );
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer ' + validToken,
          },
        }),
      }),
    } as ExecutionContext;

    const result = await guard.canActivate(context);
    expect(result).toEqual(true);
  });

  it('should throw UnauthorizedException with an invalid token', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer invalidToken',
          },
        }),
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException without a token', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
