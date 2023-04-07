import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import RedisService from '../../../redis/service';
import TokenService from '../../../token/service';

import { deviceId } from './../../../../tests/fakeAppData/userData/userData';
import { FakeRedisService } from '../../../../tests/fakeAppRepo/fakeRedisServis';
import { RefreshUserHandler } from './../../commands/handlers/refreshUserHandler';

describe('check refresh command handler', () => {
  let refreshHandler: RefreshUserHandler;
  let tokenService: TokenService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshUserHandler,
        TokenService,
        {
          provide: RedisService,
          useClass: FakeRedisService,
        },
      ],
    }).compile();

    refreshHandler = module.get(RefreshUserHandler);
    tokenService = module.get(TokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
  });

  const refreshParams = {
    refreshUserDto: {
      refreshToken: 'Bearer token',
    },
    deviceId: '1234',
  };

  it('check refresh handler', async () => {
    jest
      .spyOn(tokenService, 'verifyRefresh')
      .mockImplementation(() => Promise.resolve({ userId: 1 as never }));
    const res = await refreshHandler.execute(refreshParams);
    expect(res).toHaveProperty('accessToken');
    expect(res).toHaveProperty('refreshToken');
  });

  it('check refresh handler if unknown type auth', async () => {
    const refreshParams = {
      refreshUserDto: {
        refreshToken: 'token',
      },
      deviceId,
    };
    expect(refreshHandler.execute(refreshParams)).rejects.toThrow();
    // try {
    //   const res = await refreshHandler.execute(refreshParams);
    //   console.log(res);
    //   expect(res).toThrow();
    //   expect(res).toThrowError(
    //     'Unknown type authorization, please enter in application & repeat request',
    //   );
    // } catch (error) {
    //   expect(error).toBeInstanceOf(HttpException);
    //   expect(error.message).toBe(
    //     'Unknown type authorization, please enter in application & repeat request',
    //   );
    // }
  });
});
