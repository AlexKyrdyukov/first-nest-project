import { Module } from '@nestjs/common';
import TokenService from './service';
import tokenProviders from './providers';
import RedisModule from '../redis/module';
@Module({
  imports: [RedisModule],
  providers: [...tokenProviders, TokenService],
  exports: [TokenService],
})
class TokenModule {}

export default TokenModule;
