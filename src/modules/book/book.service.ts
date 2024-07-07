import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@app/core/database/prisma.service';
import { Author, Book, Genre } from '@prisma/client';
import { ClsService } from 'nestjs-cls';
import { ResponseDto } from '@app/common/dto/response.dto';
import { PaginationParamsDto } from '@app/common/dto/pagination.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BookDispatchedEvent } from './events/book-dispatched.event';

@Injectable()
export class BookService {
  constructor(
    private readonly db: PrismaService,
    private readonly appStorage: ClsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async create(createBookDto: CreateBookDto) {
    // get current user id
    const currentUser = this.appStorage.get('user');

    // validate author id and and  it should created by current user
    const author = await this.checkRelationResourceExists(
      createBookDto.authorId,
      'author',
    );
    this.ownershipCheck(author);

    // validate genere id and  it should created by current user
    const genre = await this.checkRelationResourceExists(
      createBookDto.genreId,
      'genre',
    );
    this.ownershipCheck(genre);

    const book = await this.db.book.create({
      data: {
        ...createBookDto,
        userId: currentUser.id,
      },
    });

    this.eventEmitter.emit(
      'book.created',
      new BookDispatchedEvent(book.id, book.title),
    );
    return new ResponseDto(book, 'book created successfully');
  }

  async findAll(pagination: PaginationParamsDto) {
    const books = await this.db.book.findMany({
      take: pagination.limit,
      skip: (pagination.page - 1) * pagination.limit,
      include: {
        author: true,
        genre: true,
      },
    });
    return new ResponseDto(books, 'book found successfully');
  }

  async search(pagination: PaginationParamsDto, search: string) {
    const books = await this.db.book.findMany({
      where: {
        OR: [
          {
            title: { contains: search },
          },
          {
            author: { name: { contains: search } },
          },
          {
            genre: { name: { contains: search } },
          },
        ],
      },
      take: pagination.limit,
      skip: (pagination.page - 1) * pagination.limit,
      include: {
        author: true,
        genre: true,
      },
    });
    return new ResponseDto(books, 'book found successfully');
  }
  async findOne(id: string) {
    // cache keys is dynamically changed ex
    // '/book/2da0b4481-d424-4de6-b8af-872e72a6628f'
    const book = await this.db.book.findUnique({
      where: { id },
      include: {
        author: true,
        genre: true,
      },
    });
    if (!book) {
      throw new NotFoundException('book Not Found');
    }
    return new ResponseDto(book, 'book found successfully');
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.db.book.findUnique({ where: { id } });
    if (!book) {
      throw new NotFoundException('book Not Found');
    }

    // update task , ownership check fo book
    this.ownershipCheck(book);

    if (updateBookDto.authorId) {
      // validate author id and and  it should created by current user
      const author = await this.checkRelationResourceExists(
        updateBookDto.authorId,
        'author',
      );
      this.ownershipCheck(author);
    }

    if (updateBookDto.genreId) {
      // validate genere id and  it should created by current user
      const genre = await this.checkRelationResourceExists(
        updateBookDto.genreId,
        'genre',
      );
      this.ownershipCheck(genre);
    }

    const updated = await this.db.book.update({
      where: { id },
      data: updateBookDto,
    });
    this.eventEmitter.emit(
      'book.updated',
      new BookDispatchedEvent(book.id, book.title),
    );
    return new ResponseDto(updated, 'book updated successfully');
  }

  async remove(id: string) {
    const book = await this.db.book.findUnique({ where: { id } });
    if (!book) {
      throw new NotFoundException('book Not Found');
    }

    // update task , ownership check
    this.ownershipCheck(book);

    const deleted = await this.db.book.delete({
      where: { id },
    });

    this.eventEmitter.emit(
      'book.deleted',
      new BookDispatchedEvent(book.id, book.title),
    );
    return new ResponseDto({}, 'book deleted successfully');
  }

  /**
   * helper function to check ownership of book or author or genre , to make sure each user can only create edit his/her data
   */
  private ownershipCheck(resource: Book | Author | Genre) {
    // get current user id
    const currentUser = this.appStorage.get('user');
    if (resource.userId !== currentUser.id) {
      throw new UnauthorizedException(
        'sorry you are not the owner of' + resource.id,
      );
    }
  }

  /**
   * helper function to check resource exists ex: author or genre
   */
  private async checkRelationResourceExists(
    resourceId: string,
    resourceType: 'author' | 'genre',
  ): Promise<Author | Genre> {
    const resource = await this.db[resourceType.toString()].findUnique({
      where: { id: resourceId },
    });
    if (!resource) {
      throw new NotFoundException(resourceType + ' Not Found');
    }

    return resource;
  }
}
