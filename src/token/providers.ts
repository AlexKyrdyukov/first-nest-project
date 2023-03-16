import RedisService from '../redis/service';

const tokenProviders = [
  {
    provide: 'TOKEN_REPOSITORY',
    useFactory: (redisClient: RedisService<string>) => redisClient,
    inject: ['REDIS_SOURCE'],
  },
];

export default tokenProviders;
