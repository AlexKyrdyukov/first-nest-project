import { createClient } from 'redis';

const redisProviders = [
  {
    provide: 'REDIS_OPTIONS',
    useValue: {
      url: 'redis://localhost:6379',
    },
  },
  {
    inject: ['REDIS_OPTIONS'],
    provide: 'REDIS_CLIENT',
    useFactory: async (options: { url: string }) => {
      const client = createClient(options);
      await client.connect();
      return client;
    },
  },
];

export default redisProviders;
