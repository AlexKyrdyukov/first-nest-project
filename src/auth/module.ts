import { Module } from '@nestjs/common';
import TokenModule from 'src/token/module';
import UserModule from 'src/user/module';
import AuthControllers from './controllers';
import AuthService from './service';
import authProviders from './providers';
import DatabaseModule from '../db/module';
import { AuthGuard } from './auth-guard';
@Module({
  providers: [...authProviders, AuthService, AuthGuard],
  controllers: [AuthControllers],
  imports: [DatabaseModule, UserModule, TokenModule],
  exports: [AuthService, AuthGuard],
})
class AuthModule {}

export default AuthModule;
