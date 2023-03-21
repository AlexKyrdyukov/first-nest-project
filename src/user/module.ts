import { Module } from '@nestjs/common';

import UserService from './service';
import userProviders from './providers';
import DatabaseModule from '../db/module';
import UserController from './controllers';
import TokenService from '../token/service';
import RedisService from '../redis/service';
import { AuthGuard } from '../auth/auth-guard';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...userProviders,
    UserService,
    AuthGuard,
    TokenService,
    RedisService,
  ],
  controllers: [UserController],
  exports: [UserService],
})
class UserModule {}

export default UserModule;
