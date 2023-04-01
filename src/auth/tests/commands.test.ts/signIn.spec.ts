import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SignInUserHandler } from '../../commands/handlers/signInUserHandler';
import { createMock } from '@golevelup/ts-jest';
import { getRepositoryToken } from '@nestjs/typeorm';
import UserEntity from '../../../db/entities/User';
import TokenService from '../../../token/service';
import { UserRepositoryFake } from '../../../../tests/fakeAppRepo/FakeUserRepository';

describe('check auth commands', () => {
  let signInHandler: SignInUserHandler;
  let tokenService: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignInUserHandler,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: UserRepositoryFake,
        },
        {
          provide: TokenService,
          useValue: {
            createTokens: jest.fn().mockReturnValue({
              accessToken: 'test',
              refreshToken: 'test1',
            }),
          },
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    signInHandler = module.get(SignInUserHandler);
    tokenService = module.get<TokenService>(TokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const signInDto = { email: 'user@mail.com', password: '123' };
  const deviceId = '12234';
  const SignInUserCommand = {
    signInDto,
    deviceId,
  };

  it('check class sign in handler', async () => {
    const res = await signInHandler.execute(SignInUserCommand);
    expect(tokenService.createTokens).toHaveBeenCalled();
    expect(res).toMatchObject({
      accessToken: 'test',
      refreshToken: 'test1',
      user: {
        userId: 2,
        email: 'tesst',
        address: {
          city: 'Moscow',
          country: 'Russia',
          street: 'Petrovskaya',
        },
      },
    });
  });

  it('check class sign in if user not found', async () => {
    try {
      await signInHandler.execute(SignInUserCommand);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('User with this email dont exist'),
        expect(error).toThrow();
    }
  });
});
