import { CommentModule } from './comment/module';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/module';
import DatabaseModule from './db/module';
import RedisModule from './redis/module';
import UserModule from './user/module';
import { ConfigModule } from '@nestjs/config';
import CryptoService from './crypto/service';
import CryptoModule from './crypto/module';
import { PostModule } from './post/module';
// import { RolesGuard } from './roles/rolesGuard';
// import { APP_GUARD } from '@nestjs/core';
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
