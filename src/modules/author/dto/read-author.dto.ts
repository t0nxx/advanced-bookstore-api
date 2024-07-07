import { Expose } from 'class-transformer';

export class ReadAuthorDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  biography: string;

  @Expose()
  birthDate: Date;
}
