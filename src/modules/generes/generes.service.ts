import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateGenereDto } from './dto/create-genere.dto';
import { UpdateGenereDto } from './dto/update-genere.dto';
import { PrismaService } from '@app/core/database/prisma.service';
import { ClsService } from 'nestjs-cls';
import { ResponseDto } from '@app/common/dto/response.dto';
import { PaginationParamsDto } from '@app/common/dto/pagination.dto';

@Injectable()
export class GeneresService {
  constructor(
    private readonly db: PrismaService,
    private readonly appStorage: ClsService,
  ) {}
  async create(createGenereDto: CreateGenereDto) {
    // get current user id
    const currentUser = this.appStorage.get('user');

    const genere = await this.db.genre.create({
      data: {
        name: createGenereDto.name,
        userId: currentUser.id,
      },
    });
    return new ResponseDto(genere, 'genere created successfully');
  }

  async findAll(pagination: PaginationParamsDto) {
    const genres = await this.db.genre.findMany({
      take: pagination.limit,
      skip: (pagination.page - 1) * pagination.limit,
    });
    return new ResponseDto(genres, 'genere found successfully');
  }

  async findOne(id: string) {
    const genere = await this.db.genre.findUnique({ where: { id } });
    if (!genere) {
      throw new NotFoundException('genere Not Found');
    }
    return new ResponseDto(genere, 'genere found successfully');
  }

  async update(id: string, updateGenereDto: UpdateGenereDto) {
    const genere = await this.db.genre.findUnique({ where: { id } });
    if (!genere) {
      throw new NotFoundException('genere Not Found');
    }

    // update task , ownership check
    const currentUser = this.appStorage.get('user');
    if (currentUser.id !== genere.userId) {
      throw new UnauthorizedException('sorry you are not the owner');
    }

    const updated = await this.db.genre.update({
      where: { id },
      data: updateGenereDto,
    });
    return new ResponseDto(updated, 'genere updated successfully');
  }

  async remove(id: string) {
    const genere = await this.db.genre.findUnique({ where: { id } });
    if (!genere) {
      throw new NotFoundException('genere Not Found');
    }

    // update task , ownership check
    const currentUser = this.appStorage.get('user');
    if (currentUser.id !== genere.userId) {
      throw new UnauthorizedException('sorry you are not the owner');
    }

    const deletd = await this.db.genre.delete({
      where: { id },
    });
    return new ResponseDto({}, 'genere deleted successfully');
  }
}
