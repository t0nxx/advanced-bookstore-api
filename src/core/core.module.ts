import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AppConfigModule } from './config/app-config.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from './config';

@Global()
@Module({
  imports: [
    DatabaseModule,
    AppConfigModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<IAppConfig['auth']>('auth').JWT_SECRET, // Fetch secret key from configuration
        signOptions: {
          expiresIn:
            configService.get<IAppConfig['auth']>('auth').JWT_EXPIRES_IN, // Fetch expiration time from configuration
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [DatabaseModule, AppConfigModule, JwtModule],
})
export class CoreModule {}
