import ms from 'ms';

import { Injectable } from '@nestjs/common';
import { redisClient } from './connect';

@Injectable()
class RedisService<T_DataType> {
  rootKey: string;

  defaultExpiresIn?: string;

  constructor(rootKey: string, defaultExpiresIn?: string) {
    this.rootKey = rootKey;
    this.defaultExpiresIn = defaultExpiresIn;
  }

  createKey = (nestedKey: string) => {
    return `${this.rootKey}:${nestedKey}`;
  };

  get = async (nestedKey: string): Promise<T_DataType> => {
    const key = this.createKey(nestedKey);

    const data = await redisClient.get(key);

    const isString = (data: string | null): data is string => {
      return (data as string)?.length !== undefined;
    };

    const parsedData = isString(data) ? JSON.parse(data) : null;

    return parsedData;
  };

  set = async (nestedKey: string, value: T_DataType, expiresIn?: string) => {
    const key = this.createKey(nestedKey);

    const strinfigyedValue = JSON.stringify(value);

    const expiresInInString = expiresIn || this.defaultExpiresIn;

    const expiresInInNumber = expiresInInString
      ? ms(expiresInInString)
      : undefined;
    await redisClient.set(key, strinfigyedValue, { EX: expiresInInNumber });
  };

  remove = async (nestedKey: string) => {
    const key = this.createKey(nestedKey);

    await redisClient.del(key);
  };
}

export default RedisService;
