import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGenereDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
