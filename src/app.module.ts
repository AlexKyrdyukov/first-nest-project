import { Module } from '@nestjs/common';
import AuthModule from './auth/module';
import DatabaseModule from './db/module';
import RedisModule from './redis/module';
import UserModule from './user/module';
import { ConfigModule } from '@nestjs/config';
import CryptoService from './crypto/crypto.service';
import CryptoModule from './crypto/crypto.module';
import { RolesGuard } from './roles/rolesGuard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot(),
    RedisModule,
    UserModule,
    AuthModule,
    CryptoModule,
  ],
  providers: [
    CryptoService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
