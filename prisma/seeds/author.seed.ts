import { CreateAuthorDto } from '@app/modules/author/dto/create-author.dto';
import { faker } from '@faker-js/faker';
export function createAuthorSeed(): CreateAuthorDto {
  return {
    name: faker.person.firstName(),

    biography: faker.person.bio(),

    birthDate: faker.date.birthdate(),
  };
}
