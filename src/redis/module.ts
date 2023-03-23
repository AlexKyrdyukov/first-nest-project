import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import redisProviders from './providers';
import RedisService from './service';
import UserModule from '../user/module';
// import UserService from '../user/service';

@Module({
  // imports: [UserModule],
  // imports: [UserModule]
  imports: [forwardRef(() => UserModule)],
  providers: [...redisProviders, RedisService, ConfigService, UserModule],
  exports: [...redisProviders, RedisService],
})
class RedisModule {}

export default RedisModule;
