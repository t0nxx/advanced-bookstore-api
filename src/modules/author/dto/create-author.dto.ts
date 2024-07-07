import { IsDate, IsISO8601, IsNotEmpty, IsString, isDate } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  biography: string;

  @IsString()
  @IsNotEmpty()
  @IsISO8601({ strict: true })
  birthDate: Date;
}
