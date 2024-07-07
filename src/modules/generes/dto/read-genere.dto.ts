import { Expose } from 'class-transformer';

export class ReadGenereDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
