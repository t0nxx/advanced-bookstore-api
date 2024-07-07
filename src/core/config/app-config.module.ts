import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import authConfig from './auth.config';
import databseConfig from './databse.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig, databseConfig],
    }),
  ],
})
export class AppConfigModule {}
