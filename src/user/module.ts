import { Module } from '@nestjs/common';
import TokenService from '../token/service';
import { AuthGuard } from '../auth/auth-guard';
import DatabaseModule from '../db/module';
import UserController from './controllers';
import userProviders from './providers';
import UserService from './service';
import RedisService from '../redis/service';

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
