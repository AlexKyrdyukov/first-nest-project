import { Module, Global } from '@nestjs/common';
import { CatsController } from './controllers/cats.controllers';
import { CatsService } from './services/cats.service';

@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
