import { IsISO8601, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsISO8601({ strict: true })
  publicationDate: Date;

  @IsNotEmpty()
  @IsUUID()
  authorId: string;

  @IsNotEmpty()
  @IsUUID()
  genreId: string;
}
