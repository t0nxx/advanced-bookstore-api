import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { BookListner } from './listners/book.listner';

@Module({
  controllers: [BookController],
  providers: [BookService, BookListner],
})
export class BookModule {}
