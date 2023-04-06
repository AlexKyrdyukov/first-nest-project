import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import CryptoService from './crypto/service';

import UserModule from './user/module';
import RedisModule from './redis/module';
import DatabaseModule from './db/module';
import { AuthModule } from './auth/module';
import { PostModule } from './post/module';
import CryptoModule from './crypto/module';
import { CommentModule } from './comment/module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot(),
    RedisModule,
    UserModule,
    AuthModule,
    CryptoModule,
    CommentModule,
    PostModule,
  ],
  providers: [CryptoService],
})
export class AppModule {}
