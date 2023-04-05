import TokenService from '../token/service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PostEntity from '../db/entities/Post';
import { CommandHandlers } from './commands/handlers';
import { PostControllers } from './controllers';
import RedisModule from '../redis/module';
import UserEntity from '../db/entities/User';
import { CqrsModule } from '@nestjs/cqrs';
import CategoryEntity from '../db/entities/Categories';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity, PostEntity, UserEntity]),
    RedisModule,
    CqrsModule,
  ],
  providers: [...CommandHandlers, TokenService],
  controllers: [PostControllers],
})
export class PostModule { }
