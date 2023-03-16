import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/db/module';
import UserController from './controllers';
import { userProviders } from './providers';
import { UserService } from './service';

@Module({
  imports: [DatabaseModule],
  providers: [...userProviders, UserService],
  controllers: [UserController],
  exports: [UserService],
})
class UserModule {}

export default UserModule;
