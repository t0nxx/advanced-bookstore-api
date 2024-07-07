export const JwtServiceMock = {
  signAsync: jest.fn(() => 'mocked-access-token'),
  verifyAsync: jest.fn(() => 'mocked-payload'),
};
