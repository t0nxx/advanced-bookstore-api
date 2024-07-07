import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      // milliseconds * minutes * hours (1 hour)
      ttl: 1000 * 60 * 60,
      isGlobal: true,
    }),
  ],
})
export class AppCacheModule {}
