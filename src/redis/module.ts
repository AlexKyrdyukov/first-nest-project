import { Module } from '@nestjs/common';
import redisProviders from './providers';
import RedisService from './service';

@Module({
  providers: [...redisProviders, RedisService],
  exports: [...redisProviders],
})
class RedisModule {}

export default RedisModule;
