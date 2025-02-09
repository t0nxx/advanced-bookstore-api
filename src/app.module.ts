import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CoreModule } from '@app/core/core.module';
import { UsersModule } from '@app/modules/users/users.module';
import { GeneresModule } from '@app/modules/generes/generes.module';
import { AuthorModule } from '@app/modules/author/author.module';
import { BookModule } from '@app/modules/book/book.module';
import { CentralizedExceptionFilter } from '@app/common/exception-filters/centralized-exception-filter.';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        // total number of requests in 60000 milliseconds (1 minute)
        limit: 20,
      },
    ]),
    CoreModule,
    UsersModule,
    GeneresModule,
    AuthorModule,
    BookModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },

    {
      provide: APP_FILTER,
      useClass: CentralizedExceptionFilter,
    },
  ],
})
export class AppModule {}
