import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BookService } from './book.service';
import { ReadBookDto } from './dto/read-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from '@app/common/guards/auth-guard.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseSerializeInterceptor } from '@app/common/interceptors/response-serialize.interceptor';
import { PaginationParamsDto } from '@app/common/dto/pagination.dto';
import { ExcludeFromAuth } from '@app/common/decorators/exclude-auth.decorator';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
@Controller('book')
@ApiTags('books')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@UseInterceptors(new ResponseSerializeInterceptor(ReadBookDto))
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @ExcludeFromAuth()
  @Get('search')
  search(@Query() pagination: PaginationParamsDto, @Query('q') search: string) {
    return this.bookService.search(pagination, search);
  }

  @ExcludeFromAuth()
  @UseInterceptors(CacheInterceptor)
  @Get()
  findAll(@Query() pagination: PaginationParamsDto) {
    console.log('from controller');
    return this.bookService.findAll(pagination);
  }
  @ExcludeFromAuth()
  @UseInterceptors(CacheInterceptor)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookService.findOne(id);
  }

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookService.remove(id);
  }
}
