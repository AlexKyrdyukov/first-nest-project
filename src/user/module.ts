import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import UserService from './service';
import RedisModule from '../redis/module';
import UserController from './controllers';
import TokenService from '../token/service';
import UserEntity from '../db/entities/User';
import { AuthGuard } from '../auth/authGuard';
import CryptoModule from '../crypto/crypto.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => RedisModule),
    CryptoModule,
  ],
  // imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, AuthGuard, TokenService],
  // providers: [UserService, AuthGuard],
  controllers: [UserController],
  exports: [UserService],
})
class UserModule {}

export default UserModule;
