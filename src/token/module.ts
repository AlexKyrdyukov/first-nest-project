import { Module } from '@nestjs/common';
import TokenService from './service';

@Module({
  providers: [TokenService],
  exports: [TokenService],
})
class TokenModule {}

export default TokenModule;
