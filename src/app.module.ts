import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CoreModule } from '@app/core/core.module';
import { UsersModule } from '@app/modules/users/users.module';

@Module({
  imports: [
    // simulate localstorage , for share req user object accross the cycle of request
    ClsModule.forRoot({
      middleware: {
        // automatically mount to all routes
        mount: true,
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        // total number of requests in 60000 milliseconds (1 minute)
        limit: 20,
      },
    ]),
    EventEmitterModule.forRoot(),
    CoreModule,
    UsersModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
