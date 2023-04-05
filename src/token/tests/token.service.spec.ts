import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import TokenService from '../service';
import RedisService from '../../redis/service';
import config from '../../config';
import { FakeRedisService } from '../../../tests/fakeAppRepo/fakeRedisServis';
import TokenModule from '../module';

class RedisFakeService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async set(): Promise<void> {}
  public async get(): Promise<string | null> {
    return 'test';
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async remove(): Promise<void> {}

  public createKey(): string {
    return 'test:key';
  }

  public confirmationStringType(value: unknown): value is string {
    return (value as string)?.length !== undefined;
  }
}

describe('token service test', () => {
  let tokenService: TokenService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        TokenModule,
        {
          provide: RedisService,
          // useClass: RedisFakeService,
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

  it('should asynSign function create token', async () => {
    const res = await tokenService.asyncSign(
      { userId: '1' },
      config.token.secret,
      {
        expiresIn: config.token.expiresIn.access,
      },
    );
    expect(res).toBeDefined();
    expect(res).toBeTruthy();
    expect(res).toHaveLength(145);
  });

  it('should asynSign function throw error', async () => {
    try {
      await tokenService.asyncSign({ userId: '1' }, 122 as unknown as string, {
        expiresIn: null as unknown as string,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBeDefined();
    }
  });

  it('should asyncVerify function throw error nevalid token', async () => {
    try {
      const res = await tokenService.asyncVerify(
        'invalid Token',
        config.token.secret,
        {
          complete: false,
        },
      );
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe(
        'User unknown type authorized please sign in application',
      );
    }
  });

  it('should asyncVerify function throw error expired token', async () => {
    try {
      const res = await tokenService.asyncVerify(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTY4MDM1MTQ4NiwiZXhwIjoxNjgwMzUyNjg2fQ.7U3GO1ikl_5jFGUaSsbS7MyGOQtiRkrl_f2biTapV0s',
        config.token.secret,
        {
          complete: false,
        },
      );
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('User unauthorized');
    }
  });

  it('should create both token', async () => {
    const res = await tokenService.createTokens(1, '1234');
    expect(res).toHaveProperty('accessToken');
    expect(res).toHaveProperty('refreshToken');
    expect(res).toBeDefined();
  });

  it('should verifyToken func throw error "User unauthorized"', async () => {
    try {
      await tokenService.verifyToken(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTY4MDM1MTQ4NiwiZXhwIjoxNjgwMzUyNjg2fQ.7U3GO1ikl_5jFGUaSsbS7MyGOQtiRkrl_f2biTapV0s',
      );
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('User unauthorized');
    }
  });

  it('should verifyToken func throw error "User unknown type authorized please sign in application"', async () => {
    try {
      await tokenService.verifyToken('invalid token');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe(
        'User unknown type authorized please sign in application',
      );
    }
  });

  it('should verifyRefresh func return payload from valid token', async () => {
    jest.spyOn(redisService, 'get').mockResolvedValue('valid refreshToken');
    jest
      .spyOn(tokenService, 'verifyToken')
      .mockResolvedValue({ userId: 1 as never });
    const res = await tokenService.verifyRefresh('12345', 'valid refreshToken');
    expect(res).toBeDefined();
    expect(res).toHaveProperty('userId');
  });

  it('should verifyRefresh func throw error "Please sign in application and repeat request"', async () => {
    jest.spyOn(redisService, 'get').mockResolvedValue('valid refreshToken');
    try {
      await tokenService.verifyRefresh('12345', 'invalid refreshToken');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe(
        'Please sign in application and repeat request',
      );
    }
  });

  it('should verifyRefresh func throw error refreshToken be expired', async () => {
    jest
      .spyOn(redisService, 'get')
      .mockResolvedValue(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTY4MDM1MTQ4NiwiZXhwIjoxNjgwMzUyNjg2fQ.7U3GO1ikl_5jFGUaSsbS7MyGOQtiRkrl_f2biTapV0s',
      );
    try {
      await tokenService.verifyRefresh(
        '12345',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTY4MDM1MTQ4NiwiZXhwIjoxNjgwMzUyNjg2fQ.7U3GO1ikl_5jFGUaSsbS7MyGOQtiRkrl_f2biTapV0s',
      );
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('User unauthorized');
    }
  });
});
