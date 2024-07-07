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
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { ReadAuthorDto } from './dto/read-author.dto';
import { AuthGuard } from '@app/common/guards/auth-guard.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseSerializeInterceptor } from '@app/common/interceptors/response-serialize.interceptor';
import { PaginationParamsDto } from '@app/common/dto/pagination.dto';

@Controller('author')
@ApiTags('authors')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@UseInterceptors(new ResponseSerializeInterceptor(ReadAuthorDto))
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @Get()
  findAll(@Query() pagination: PaginationParamsDto) {
    return this.authorService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.authorService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    return this.authorService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.authorService.remove(id);
  }
}
