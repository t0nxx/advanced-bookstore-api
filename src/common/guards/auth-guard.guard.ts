import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClsService } from 'nestjs-cls';
import { IAppConfig } from '@app/core/config';
import { Reflector } from '@nestjs/core';
import { EXCLUDE_FROM_AUTH_KEY } from '../decorators/exclude-auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private readonly appStorage: ClsService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // exclude from auth , useful for routes that don't require authentication and want to be public
    const excludeFromAuth = this.reflector.getAllAndOverride<boolean>(
      EXCLUDE_FROM_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (excludeFromAuth) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<IAppConfig['auth']>('auth').JWT_SECRET,
      });
      request['user'] = payload;
      // store user data to storage
      this.appStorage.set('user', payload);
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
