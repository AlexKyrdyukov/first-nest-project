import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import RedisModule from '../redis/module';
import { UserControllers } from './controllers';
import TokenService from '../token/service';
import UserEntity from '../db/entities/User';
import CryptoModule from '../crypto/module';
import AddressEntity from '../db/entities/Address';
import PostEntity from '../db/entities/Post';
import CategoriesEntity from '../db/entities/Categories';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';
import CommentEntity from '../db/entities/Comment';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      AddressEntity,
      PostEntity,
      CategoriesEntity,
      CommentEntity,
    ]),
    forwardRef(() => RedisModule),
    CryptoModule,
    CqrsModule,
  ],
  providers: [...CommandHandlers, TokenService],
  controllers: [UserControllers],
  exports: [],
})
class UserModule {}

export default UserModule;
