import { Module } from '@nestjs/common';
import AuthModule from './auth/module';
import DatabaseModule from './db/module';
import RedisModule from './redis/module';
import UserModule from './user/module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot(),
    RedisModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
