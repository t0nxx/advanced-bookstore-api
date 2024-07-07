import { Module } from '@nestjs/common';
import { GeneresService } from './generes.service';
import { GeneresController } from './generes.controller';

@Module({
  controllers: [GeneresController],
  providers: [GeneresService],
})
export class GeneresModule {}
