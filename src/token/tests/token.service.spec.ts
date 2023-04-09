import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import config from '../../config';
import TokenService from '../service';
import RedisService from '../../redis/service';
import { FakeRedisService } from '../../../tests/fakeAppRepo/fakeRedisServis';

describe('token service test', () => {
  let tokenService: TokenService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: RedisService,
          useClass: FakeRedisService,
        },
      ],
    }).compile();
    tokenService = module.get<TokenService>(TokenService);
    redisService = module.get(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('should asyncSign function create token', async () => {
    const result = await tokenService.asyncSign(
      { userId: '1' },
      config.token.secret,
      {
        expiresIn: config.token.expiresIn.access,
      },
    );
    expect(result).toBeDefined();
    expect(result).toBeTruthy();
    expect(result).toHaveLength(145);
  });

  it('should asynSign function throw error', async () => {
    await tokenService
      .asyncSign({ userId: '1' }, 122 as unknown as string, {
        expiresIn: null as unknown as string,
      })
      .catch((err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain(
          '"expiresIn" should be a number of seconds or string representing a timespan',
        );
      });
  });

  it('should asyncVerify function throw error invalid token', async () => {
    await tokenService
      .asyncVerify('invalid Token', config.token.secret, {
        complete: false,
      })
      .catch((err) => {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(401);
        expect(err.message).toContain(
          'User unknown type authorized please sign in application',
        );
      });
  });

  it('should asyncVerify function throw error expired token', async () => {
    await tokenService
      .asyncVerify(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTY4MDM1MTQ4NiwiZXhwIjoxNjgwMzUyNjg2fQ.7U3GO1ikl_5jFGUaSsbS7MyGOQtiRkrl_f2biTapV0s',
        config.token.secret,
        {
          complete: false,
        },
      )
      .catch((err) => {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(401);
        expect(err.message).toBe('User unauthorized');
      });
  });

  it('should create both token', async () => {
    const result = await tokenService.createTokens(1, '1234');
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(result).toBeDefined();
  });

  it('should verifyToken func throw error "User unauthorized"', async () => {
    await tokenService
      .verifyToken(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTY4MDM1MTQ4NiwiZXhwIjoxNjgwMzUyNjg2fQ.7U3GO1ikl_5jFGUaSsbS7MyGOQtiRkrl_f2biTapV0s',
      )
      .catch((err) => {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(401);
        expect(err.message).toBe('User unauthorized');
      });
  });

  it('should verifyToken func throw error "User unknown type authorized please sign in application"', async () => {
    await tokenService.verifyToken('invalid token').catch((err) => {
      expect(err).toBeInstanceOf(HttpException);
      expect(err.status).toBe(401);
      expect(err.message).toBe(
        'User unknown type authorized please sign in application',
      );
    });
  });

  it('should verifyRefresh func, & return payload from valid token', async () => {
    jest.spyOn(redisService, 'get').mockResolvedValue('valid refreshToken');
    jest
      .spyOn(tokenService, 'verifyToken')
      .mockResolvedValue({ userId: 1 as never });
    const res = await tokenService.verifyRefresh('12345', 'valid refreshToken');
    expect(res).toBeDefined();
    expect(res).toHaveProperty('userId', 1);
  });

  it('should verifyRefresh func throw error "Please sign in application and repeat request"', async () => {
    jest.spyOn(redisService, 'get').mockResolvedValue('valid refreshToken');
    await tokenService
      .verifyRefresh('12345', 'invalid refreshToken')
      .catch((err) => {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(403);
        expect(err.message).toBe(
          'Please sign in application and repeat request',
        );
      });
  });

  it('should verifyRefresh func throw error refreshToken be expired', async () => {
    jest
      .spyOn(redisService, 'get')
      .mockResolvedValue(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTY4MDM1MTQ4NiwiZXhwIjoxNjgwMzUyNjg2fQ.7U3GO1ikl_5jFGUaSsbS7MyGOQtiRkrl_f2biTapV0s',
      );
    await tokenService
      .verifyRefresh(
        '12345',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTY4MDM1MTQ4NiwiZXhwIjoxNjgwMzUyNjg2fQ.7U3GO1ikl_5jFGUaSsbS7MyGOQtiRkrl_f2biTapV0s',
      )
      .catch((err) => {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(401);
        expect(err.message).toBe('User unauthorized');
      });
  });
});
