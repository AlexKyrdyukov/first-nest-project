import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import RedisService from './service';
import redisProviders from './providers';

@Module({
  providers: [...redisProviders, RedisService, ConfigService],
  exports: [...redisProviders, RedisService],
})
class RedisModule {
  static forRoot: any;
}

export default RedisModule;
