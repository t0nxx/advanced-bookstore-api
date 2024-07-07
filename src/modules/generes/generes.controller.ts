import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  UseGuards,
  Query,
} from '@nestjs/common';
import { GeneresService } from './generes.service';
import { CreateGenereDto } from './dto/create-genere.dto';
import { UpdateGenereDto } from './dto/update-genere.dto';
import { ResponseSerializeInterceptor } from '@app/common/interceptors/response-serialize.interceptor';
import { ReadGenereDto } from './dto/read-genere.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@app/common/guards/auth-guard.guard';
import { PaginationParamsDto } from '@app/common/dto/pagination.dto';

@Controller('generes')
@ApiTags('generes')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@UseInterceptors(new ResponseSerializeInterceptor(ReadGenereDto))
export class GeneresController {
  constructor(private readonly generesService: GeneresService) {}

  @Post()
  create(@Body() createGenereDto: CreateGenereDto) {
    return this.generesService.create(createGenereDto);
  }

  @Get()
  findAll(@Query() pagination: PaginationParamsDto) {
    return this.generesService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.generesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGenereDto: UpdateGenereDto,
  ) {
    return this.generesService.update(id, updateGenereDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.generesService.remove(id);
  }
}
