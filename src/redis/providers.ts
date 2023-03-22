import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

const redisProviders = [
  {
    inject: [ConfigService],
    provide: 'REDIS_OPTIONS',
    useFactory: (configService: ConfigService) => ({
      url: `redis://${configService.get('REDIS_URL')}`,
    }),
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
