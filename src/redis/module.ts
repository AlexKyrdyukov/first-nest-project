import { Module } from '@nestjs/common';
import redisProviders from './providers';

@Module({
  providers: [...redisProviders],
  exports: [...redisProviders],
})
class RedisModule {}

export default RedisModule;
