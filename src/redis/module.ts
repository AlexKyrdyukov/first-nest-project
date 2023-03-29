import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import redisProviders from './providers';
import RedisService from './service';
import UserModule from '../user/module';
// import UserService from '../user/service';

@Module({
  // imports: [forwardRef(() => UserModule)],
  providers: [...redisProviders, RedisService, ConfigService],
  exports: [...redisProviders, RedisService],
})
class RedisModule {
  static forRoot: any;
}

export default RedisModule;
