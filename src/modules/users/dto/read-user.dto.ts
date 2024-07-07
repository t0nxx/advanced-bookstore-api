import { Expose } from 'class-transformer';

export class ReadUserDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
