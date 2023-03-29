import { Test, TestingModule } from '@nestjs/testing';
import RedisService from '../service';

class RedisRepositoryFake {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async set(): Promise<void> {}
  public async get(): Promise<{ [key: string]: string } | string | null> {
    // return { test: 'test' };
    return '{ "test": "test"}';
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async del(): Promise<void> {}

  public createKey(): string {
    return 'test:key';
  }

  public confirmationStringType(value: unknown): value is string {
    return (value as string)?.length !== undefined;
  }
}

describe('redis service test', () => {
  let service: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: 'REDIS_CLIENT',
          useClass: RedisRepositoryFake,
        },
      ],
    }).compile();
    service = module.get<RedisService>(RedisService);
  });

  it('set value with expected value', async () => {
    const res = await service.set('test', '1234', 'token', '10m');
    expect(res).not.toBeDefined();
  });

  it('set value', async () => {
    const res = await service.set('test', '1234', 'token', '10m');
    expect(res).not.toBeDefined();
  });

  it('get value', async () => {
    const res = await service.get('test', 'test');
    expect(res).toStrictEqual({ test: 'test' });
  });

  it('test func create key', () => {
    const res = service.createKey('test', 'tests');
    expect(res).toBe('test:tests');
  });

  it('test function remove', async () => {
    const res = await service.remove('test', 'test');
    expect(res).not.toBeDefined();
  });

  it('test function confirm type if string', () => {
    const res = service.confirmationStringType('test');
    expect(res).toBeTruthy();
  });

  it('test function confirm type if string', () => {
    const res = service.confirmationStringType(22);
    expect(res).toBeFalsy();
  });
});
