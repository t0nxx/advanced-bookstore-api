import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { createGernereSeed } from './seeds/genere.seed';
import { createAuthorSeed } from './seeds/author.seed';

const prisma = new PrismaClient();
async function main() {
  // seed user1
  await prisma.user.upsert({
    where: { email: 'user1@email.com' },
    update: {},
    create: {
      email: 'user1@email.com',
      name: 'user1',
      // pass 123456
      password: '$2b$10$66puH55yO18dYCWJc2g9ReLzF0TVaPrwQay0mmm7GPOURTLHpCXRe',

      genres: {
        create: faker.helpers.multiple(createGernereSeed, { count: 5 }),
      },
      authors: {
        create: faker.helpers.multiple(createAuthorSeed, { count: 5 }),
      },
    },
  });
  // seed user2
  await prisma.user.upsert({
    where: { email: 'user2@email.com' },
    update: {},
    create: {
      email: 'user2@email.com',
      name: 'user2',
      // pass 123456
      password: '$2b$10$66puH55yO18dYCWJc2g9ReLzF0TVaPrwQay0mmm7GPOURTLHpCXRe',

      genres: {
        create: faker.helpers.multiple(createGernereSeed, { count: 5 }),
      },
      authors: {
        create: faker.helpers.multiple(createAuthorSeed, { count: 5 }),
      },
    },
  });

  // seed books
  const genres = await prisma.genre.findMany();
  const authors = await prisma.author.findMany();
  const createBookSeed = Array.from({ length: 10 }).map(() => {
    const randomGenre = faker.helpers.arrayElement(genres);
    const randomAuthor = faker.helpers.arrayElement(authors);
    return {
      title: faker.lorem.words(3),
      description: faker.lorem.words(10),
      publicationDate: faker.date.recent(),
      authorId: randomAuthor.id,
      genreId: randomGenre.id,
      userId: randomAuthor.userId,
    };
  });

  await prisma.book.createMany({
    data: createBookSeed,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
