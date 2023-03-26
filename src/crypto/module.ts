import { Module } from '@nestjs/common';
import CryptoService from './service';

@Module({
  providers: [CryptoService],
  exports: [CryptoService],
})
class CryptoModule {}

export default CryptoModule;
