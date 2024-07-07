import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@app/core/database/prisma.service';
import { ClsService } from 'nestjs-cls';
import { ResponseDto } from '@app/common/dto/response.dto';
import { PaginationParamsDto } from '@app/common/dto/pagination.dto';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorService {
  constructor(
    private readonly db: PrismaService,
    private readonly appStorage: ClsService,
  ) {}
  async create(createAuthorDto: CreateAuthorDto) {
    // get current user id
    const currentUser = this.appStorage.get('user');

    const author = await this.db.author.create({
      data: {
        ...createAuthorDto,
        userId: currentUser.id,
      },
    });
    return new ResponseDto(author, 'author created successfully');
  }

  // get all authors of current user not for all users , meanful because owner can delete/update his data will reflect in current user data
  async findAll(pagination: PaginationParamsDto) {
    const authors = await this.db.author.findMany({
      where: { userId: this.appStorage.get('user').id },
      take: pagination.limit,
      skip: (pagination.page - 1) * pagination.limit,
    });
    return new ResponseDto(authors, 'author found successfully');
  }

  async findOne(id: string) {
    const author = await this.db.author.findUnique({ where: { id } });
    if (!author) {
      throw new NotFoundException('author Not Found');
    }
    return new ResponseDto(author, 'author found successfully');
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    const author = await this.db.author.findUnique({ where: { id } });
    if (!author) {
      throw new NotFoundException('author Not Found');
    }

    // update task , ownership check
    const currentUser = this.appStorage.get('user');
    if (currentUser.id !== author.userId) {
      throw new UnauthorizedException('sorry you are not the owner');
    }

    const updated = await this.db.author.update({
      where: { id },
      data: updateAuthorDto,
    });
    return new ResponseDto(updated, 'author updated successfully');
  }

  async remove(id: string) {
    const author = await this.db.author.findUnique({ where: { id } });
    if (!author) {
      throw new NotFoundException('author Not Found');
    }

    // update task , ownership check
    const currentUser = this.appStorage.get('user');
    if (currentUser.id !== author.userId) {
      throw new UnauthorizedException('sorry you are not the owner');
    }

    const deleted = await this.db.author.delete({
      where: { id },
    });
    return new ResponseDto({}, 'author deleted successfully');
  }
}
