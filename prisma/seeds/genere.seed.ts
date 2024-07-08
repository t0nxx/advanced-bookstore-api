import { CreateGenereDto } from '@app/modules/generes/dto/create-genere.dto';
import { faker } from '@faker-js/faker';
export function createGernereSeed(): CreateGenereDto {
  return {
    name: faker.vehicle.type(),
  };
}
