import { ReadAuthorDto } from '@app/modules/author/dto/read-author.dto';
import { ReadGenereDto } from '@app/modules/generes/dto/read-genere.dto';
import { Expose, Transform, Type } from 'class-transformer';

export class ReadBookDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  publicationDate: Date;

  @Expose()
  @Type(() => ReadAuthorDto)
  author: ReadAuthorDto;

  @Expose()
  @Type(() => ReadGenereDto)
  genre: ReadGenereDto;
}
