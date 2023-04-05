import TokenService from '../token/service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PostEntity from '../db/entities/Post';
import CommentEntity from '../db/entities/Comment';
import { CommandHamdlers } from './commands/handlers';
import { CommentControllers } from './controllers';
import RedisModule from '../redis/module';
import UserEntity from '../db/entities/User';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, PostEntity, UserEntity]),
    RedisModule,
    CqrsModule,
  ],
  providers: [...CommandHamdlers, TokenService],
  controllers: [CommentControllers],
})
export class CommentModule {}
