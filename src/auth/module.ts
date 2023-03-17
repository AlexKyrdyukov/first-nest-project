import { Module } from '@nestjs/common';
import UserModule from 'src/user/module';
import UserService from '../user/service';
import AuthControllers from './controllers';
import AuthService from './service';
// import userProviders from './providers';
@Module({
  // providers: [AuthService],
  // controllers: [AuthControllers],
  imports: [UserModule],
  // exports: [AuthService],
})
class AuthModule {}

export default AuthModule;
