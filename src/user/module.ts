import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import UserService from './service';
import RedisModule from '../redis/module';
import UserController from './controllers';
import TokenService from '../token/service';
import UserEntity from '../db/entities/User';
import { AuthGuard } from '../auth/authGuard';
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), RedisModule],
  providers: [UserService, AuthGuard, TokenService],
  controllers: [UserController],
  exports: [UserService],
})
class UserModule {}

export default UserModule;
