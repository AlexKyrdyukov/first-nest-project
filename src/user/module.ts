import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';

import CommentEntity from '../db/entities/Comment';

import RedisModule from '../redis/module';
import CryptoModule from '../crypto/module';

import PostEntity from '../db/entities/Post';
import UserEntity from '../db/entities/User';
import AddressEntity from '../db/entities/Address';
import CategoriesEntity from '../db/entities/Categories';

import TokenService from '../token/service';
import { UserControllers } from './controllers';
import { CommandHandlers } from './commands/handlers';
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
