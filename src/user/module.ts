import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// import UserService from './service';
import RedisModule from '../redis/module';
import UserController from './controllers';
import TokenService from '../token/service';
import UserEntity from '../db/entities/User';
import { AuthGuard } from '../auth/authGuard';
import CryptoModule from '../crypto/module';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => RedisModule),
    CryptoModule,
    CqrsModule,
  ],
  // providers: [AuthGuard, TokenService],
  providers: [...CommandHandlers, TokenService],

  controllers: [UserController],
  exports: [],
})
class UserModule {}

export default UserModule;
