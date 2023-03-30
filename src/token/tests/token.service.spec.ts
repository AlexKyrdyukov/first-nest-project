import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import TokenService from '../service';
import RedisService from '../../redis/service';
import config from '../../config';

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
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: RedisService,
          useClass: RedisFakeService,
        },
      ],
    }).compile();
    service = module.get<TokenService>(TokenService);
  });

  it('check func async sign', async () => {
    const res = await service.asyncSign({ iserId: '1' }, config.token.secret, {
      expiresIn: config.token.expiresIn.access,
    });
    expect(res).toBeDefined();
  });

  it('check func async verify wih unexpected data', async () => {
    try {
      const res = await service.asyncVerify(
        'dfgdfgdfgdf',
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

  it('check function create tokens', async () => {
    const res = await service.createTokens(1, '1234');
    expect(res).toBeDefined();
  });
});
