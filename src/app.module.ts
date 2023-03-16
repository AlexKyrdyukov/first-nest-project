import { Module } from '@nestjs/common';
import AuthModule from './auth/module';
import DatabaseModule from './db/module';
import RedisModule from './redis/module';
import UserModule from './user/module';

@Module({
  imports: [DatabaseModule, RedisModule, UserModule, AuthModule],
})
export class AppModule {}
