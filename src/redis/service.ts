// eslint-disable-next-line @typescript-eslint/no-var-requires
const ms = require('ms');

import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from '@redis/client';

@Injectable()
class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: RedisClientType,
  ) {}

  confirmationStringType(value: unknown): value is string {
    return (value as string)?.length !== undefined;
  }

  createKey(rootKey: string, nestedKey: string) {
    return `${rootKey}:${nestedKey}`;
  }

  get = async (rootKey: string, nestedKey: string): Promise<string | null> => {
    // change type
    const key = this.createKey(rootKey, nestedKey);

    const data = await this.redisClient.get(key);

    const parsedData = this.confirmationStringType(data)
      ? JSON.parse(data)
      : null;

    return parsedData;
  };

  set = async (
    rootKey: string,
    nestedKey: string,
    value: string,
    expiresIn: string,
  ) => {
    const key = this.createKey(rootKey, nestedKey);
    const strinfigyedValue = JSON.stringify(value);

    const expiresInMs = expiresIn ? ms(expiresIn) : undefined;
    await this.redisClient.set(key, strinfigyedValue, {
      EX: expiresInMs,
    });
  };

  remove = async (rootKey: string, nestedKey: string) => {
    const key = this.createKey(rootKey, nestedKey);

    await this.redisClient.del(key);
  };
}

export default RedisService;
