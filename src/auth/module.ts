import { Module } from '@nestjs/common';

import TokenModule from '../token/module';
import UserModule from '../user/module';
import AuthControllers from './controllers';
import AuthService from './service';
import { AuthGuard } from './authGuard';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from '../db/entities/User';
@Module({
  providers: [AuthService, AuthGuard],
  controllers: [AuthControllers],
  imports: [TypeOrmModule.forFeature([UserEntity]), UserModule, TokenModule],
  exports: [AuthService, AuthGuard],
})
class AuthModule {}

export default AuthModule;
