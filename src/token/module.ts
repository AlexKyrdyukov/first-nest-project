import { Module } from '@nestjs/common';
import TokenService from './service';
import RedisModule from '../redis/module';

@Module({
  imports: [RedisModule],
  providers: [TokenService],
  exports: [TokenService],
})
class TokenModule {}

export default TokenModule;
