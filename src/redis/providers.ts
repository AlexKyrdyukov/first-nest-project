import connectToRedis from './connect';

const redisProviders = [
  {
    provide: 'DATA_SOURCE_REDIS',
    useFactory: async () => connectToRedis(),
  },
];

export default redisProviders;
