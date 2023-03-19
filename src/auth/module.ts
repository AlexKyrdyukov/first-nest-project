import { Module } from '@nestjs/common';
import TokenModule from 'src/token/module';
import UserModule from 'src/user/module';
import AuthControllers from './controllers';
import AuthService from './service';
import authProviders from './providers';
import DatabaseModule from '../db/module';
@Module({
  providers: [...authProviders, AuthService],
  controllers: [AuthControllers],
  imports: [DatabaseModule, UserModule, TokenModule],

  exports: [AuthService],
})
class AuthModule {}

export default AuthModule;
