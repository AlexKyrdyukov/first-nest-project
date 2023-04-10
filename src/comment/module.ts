import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import PostEntity from '../db/entities/Post';
import UserEntity from '../db/entities/User';
import CommentEntity from '../db/entities/Comment';

import TokenService from '../token/service';
import RedisModule from '../redis/module';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './query/handlers';
import { CommentControllers } from './controllers';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, PostEntity, UserEntity]),
    RedisModule,
    CqrsModule,
  ],
  providers: [...CommandHandlers, ...QueryHandlers, TokenService],
  controllers: [CommentControllers],
})
export class CommentModule {}
