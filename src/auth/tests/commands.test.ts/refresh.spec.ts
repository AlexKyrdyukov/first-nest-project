import { HttpException, HttpStatus } from '@nestjs/common';
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

  it('should pass test annd return accessToken, refreshToken', async () => {
    jest
      .spyOn(tokenService, 'verifyRefresh')
      .mockImplementation(() => Promise.resolve({ userId: 1 as never }));
    const res = await refreshHandler.execute(refreshParams);
    expect(res).toHaveProperty('accessToken');
    expect(res).toHaveProperty('refreshToken');
  });

  it('should throw error verify refresh ', async () => {
    jest
      .spyOn(tokenService, 'verifyRefresh')
      .mockImplementation(() =>
        Promise.reject(
          new HttpException(
            'Please sign in application and repeat request',
            HttpStatus.FORBIDDEN,
          ),
        ),
      );

    await refreshHandler.execute(refreshParams).catch((err) => {
      expect(err).toBeInstanceOf(HttpException);
      expect(err).toHaveProperty('status', 403);
      expect(err.message).toContain(
        'Please sign in application and repeat request',
      );
    });
  });

  it('should throw error unknown type authorization', async () => {
    const refreshParams = {
      refreshUserDto: {
        refreshToken: 'token',
      },
      deviceId,
    };

    await refreshHandler.execute(refreshParams).catch((err) => {
      expect(err).toBeInstanceOf(HttpException);
      expect(err).toHaveProperty('status', 401);
      expect(err.message).toContain('Unknown type authorization');
    });
  });

  it('should throw error authorization', async () => {
    const params = {
      ...refreshParams,
      deviceId: null as unknown as string,
    };

    await refreshHandler.execute(params).catch((err) => {
      expect(err).toBeInstanceOf(HttpException);
      expect(err).toHaveProperty('status', 401);
      expect(err.message).toContain('Unknown type authorization');
    });
  });

  it('should throw error authorization', async () => {
    const params = {
      ...refreshParams,
      deviceId: 3333 as unknown as string,
    };

    await refreshHandler.execute(params).catch((err) => {
      expect(err).toBeInstanceOf(HttpException);
      expect(err).toHaveProperty('status', 401);
      expect(err.message).toContain('Unknown type authorization');
    });
  });
});
