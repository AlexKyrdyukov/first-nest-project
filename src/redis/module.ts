import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import redisProviders from './providers';
import RedisService from './service';

@Module({
  providers: [...redisProviders, RedisService, ConfigService],
  exports: [...redisProviders, RedisService],
})
class RedisModule {}

export default RedisModule;
