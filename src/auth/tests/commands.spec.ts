import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandHandlers } from '../commands/handlers';
import { SignInUserHandler } from '../commands/handlers/signInUserHandler';
import { createMock } from '@golevelup/ts-jest';
import { getRepositoryToken } from '@nestjs/typeorm';
import UserEntity from '../../db/entities/User';
import TokenService from '../../token/service';
class UserRepositoryFake {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public create(): void { }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async save(): Promise<void> { }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async remove(): Promise<void> { }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async findOne(): Promise<void> { }

  public createTokens = jest.fn().mockReturnValue({
    accessToken: 'mmm',
    refreshToken: 'ffff',
  });

  public createQueryBuilder = jest.fn(() => ({
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockReturnValue({
      userId: 2,
      email: 'tesst',
      address: {
        city: 'Moscow',
        country: 'Russia',
        street: 'Petrovskaya',
      },
    }),
  }));
}

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
          // useValue: createMock<TokenService>(),
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

  const signInDto = { email: 'ddddd', password: '123' };
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

  function forEach(items: number[], callback: (el: number) => void) {
    for (let index = 0; index < items.length; index++) {
      callback(items[index]);
    }
  }
  const mockCallback = jest.fn((x: number) => 42 + x);

  test('forEach mock function', () => {
    const axios = {
      get: async (a: string): Promise<{ data: string }> => 'dddddd',
    };
    class Users {
      static all() {
        return axios.get('/users.json').then((resp) => resp.data);
      }
    }

    jest.mock('axios');

    test('should fetch users', () => {
      const users = [{ name: 'Bob' }];
      const resp = { data: users };
      axios.get.mockResolvedValue(resp);

      // or you could use the following depending on your use case:
      // axios.get.mockImplementation(() => Promise.resolve(resp))

      return Users.all().then((data) => expect(data).toEqual(users));
    });
  });
});
