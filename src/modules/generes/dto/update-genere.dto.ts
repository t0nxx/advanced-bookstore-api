import { PartialType } from '@nestjs/mapped-types';
import { CreateGenereDto } from './create-genere.dto';

export class UpdateGenereDto extends PartialType(CreateGenereDto) {}
