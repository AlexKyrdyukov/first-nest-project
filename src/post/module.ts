import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import TokenService from '../token/service';
import { TypeOrmModule } from '@nestjs/typeorm';

import PostEntity from '../db/entities/Post';
import UserEntity from '../db/entities/User';
import CategoryEntity from '../db/entities/Categories';

import RedisModule from '../redis/module';
import { PostControllers } from './controllers';
import { CommandHandlers } from './commands/handlers';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity, PostEntity, UserEntity]),
    RedisModule,
    CqrsModule,
  ],
  providers: [...CommandHandlers, TokenService],
  controllers: [PostControllers],
})
export class PostModule {}
