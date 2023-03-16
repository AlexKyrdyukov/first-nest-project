import { Module } from '@nestjs/common';
import { UserService } from '../user/service';
import AuthControllers from './controllers';
import AuthService from './service';

@Module({
  providers: [AuthService],
  controllers: [AuthControllers],
  imports: [UserService],
})
class AuthModule {}

export default AuthModule;
