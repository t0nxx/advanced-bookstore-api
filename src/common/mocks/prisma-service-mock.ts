let base = {
  findUnique: jest.fn(),
  create: jest.fn(),
  findMany: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
export const prismaServiceMock = {
  user: base,
  genre: base,
  author: base,
  book: base,
};
