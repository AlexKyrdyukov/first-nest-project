import TokenService from '../token/service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PostEntity from 'src/db/entities/Post';
import { CommandHandlers } from './commands/handlers';
import { PostControllers } from './controllers';
import RedisModule from '../redis/module';
import UserEntity from 'src/db/entities/User';
import { CqrsModule } from '@nestjs/cqrs';
import CategoryEntity from 'src/db/entities/Categories';

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
