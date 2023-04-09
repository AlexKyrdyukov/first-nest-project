import { Test, TestingModule } from '@nestjs/testing';
import RedisService from '../service';
class RedisRepositoryFake {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async set(): Promise<void> {}

  public async get(): Promise<{ [key: string]: string } | string | null> {
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
  let redisClient: RedisRepositoryFake;

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
    redisClient = module.get('REDIS_CLIENT');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('should set value return undefined', async () => {
    const result = await service.set('rootKey', 'nestedKey', 'token', '10m');
    expect(result).toBeUndefined();
    expect(result).not.toBeDefined();
  });

  it('should set value with third  parametrs', async () => {
    const result = await service.set('test', '1234', 'token');
    expect(result).toBeUndefined();
    expect(result).not.toBeDefined();
  });

  it('should get value is null', async () => {
    jest.spyOn(redisClient, 'get').mockResolvedValue(null);
    const result = await service.get('test', '1234');
    expect(result).toBeNull();
    expect(result).toBe(null);
  });

  it('should get valid value', async () => {
    const result = await service.get('test', 'test');
    expect(result).not.toBeNull();
    expect(result).toStrictEqual({ test: 'test' });
  });

  it('test func create key', () => {
    const result = service.createKey('test', 'tests');
    expect(result).not.toBeUndefined();
    expect(result).not.toBeNull();
    expect(result).toBe('test:tests');
  });

  it('test function remove', async () => {
    const result = await service.remove('test', 'test');
    expect(result).toBeUndefined();
    expect(result).not.toBeDefined();
  });
});
