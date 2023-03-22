// eslint-disable-next-line @typescript-eslint/no-var-requires
const ms = require('ms');

import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from '@redis/client';

@Injectable()
class RedisService<T_DataType> {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: RedisClientType,
  ) {}

  createKey = (rootKey: string, nestedKey: string) => {
    return `${rootKey}:${nestedKey}`;
  };

  get = async (rootKey: string, nestedKey: string): Promise<T_DataType> => {
    const key = this.createKey(rootKey, nestedKey);

    const data = await this.redisClient.get(key);

    const isString = (data: string | null): data is string => {
      return (data as string)?.length !== undefined;
    };

    const parsedData = isString(data) ? JSON.parse(data) : null;

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

    const expiresInInString = expiresIn; // || this.defaultExpiresIn;
    const expiresInInNumber = expiresInInString
      ? ms(expiresInInString)
      : undefined;
    await this.redisClient.set(key, strinfigyedValue, {
      EX: expiresInInNumber,
    });
  };

  remove = async (rootKey: string, nestedKey: string) => {
    const key = this.createKey(rootKey, nestedKey);

    await this.redisClient.del(key);
  };
}

export default RedisService;
