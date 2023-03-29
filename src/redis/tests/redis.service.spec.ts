import { CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
// import RedisModule from '../module';
import redisProviders from '../providers';
import RedisService from '../service';
import type { RedisClientType } from '@redis/client';

class RedisRepositoryFake {
  public async redis(data: string, key: string) {
    const store = new Set();
  }
  public async set(): Promise<void> {}
  public async get(rootKey: string, nestedKey: string): Promise<string | null> {
    const key = this.createKey(rootKey, nestedKey);
    return;
  }
  public async remove(): Promise<void> {}

  public createKey(rootKey: string, nestedKey: string): string {
    return `${rootKey}:${nestedKey}`;
  }
}

describe('redis service test', () => {
  let service: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CACHE_MANAGER,
          useClass: RedisRepositoryFake,
        },
      ],
    }).compile();
    service = module.get(CACHE_MANAGER);
  });

  it('set value with expected value', async () => {
    console.log('111', service);
    const res = await service.set('test', '1234', 'token', '10m');
    expect(res).not.toBeDefined();
  });

  it('get value', async () => {
    const res = await service.set('test', '1234', 'token', '10m');
    expect(res).not.toBeDefined();
  });

  it('set value', async () => {
    const res = await service.set('test', '1234', 'token', '10m');
    expect(res).not.toBeDefined();
  });

  it('test func create key', () => {
    const res = service.createKey('test', 'test');
    expect(res).toBe('test:test');
  });
});
