import RedisService from '../redis/service';

const tokenProviders = [
  {
    provide: 'REDIS_SERVICE',
    useFactory: (redisClient: RedisService<string>) => redisClient,
    inject: ['DATA_SOURCE_REDIS'],
  },
];

export default tokenProviders;
