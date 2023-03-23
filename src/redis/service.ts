// eslint-disable-next-line @typescript-eslint/no-var-requires
const ms = require('ms');

import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from '@redis/client';
import UserService from '../user/service';

@Injectable()
class RedisService<T_DataType> {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: RedisClientType,
    private readonly userService: UserService,
  ) {}

  createKey(rootKey: string, nestedKey: string) {
    return `${rootKey}:${nestedKey}`;
  }

  get = async (rootKey: string, nestedKey: string): Promise<T_DataType> => {
    const key = this.createKey(rootKey, nestedKey);

    const data = await this.redisClient.get(key);

    const parsedData = this.userService.confirmationStringType(data)
      ? JSON.parse(data)
      : null;

    return parsedData;
  };
  set = async (
    rootKey: string,
    nestedKey: string,
    value: T_DataType,
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
