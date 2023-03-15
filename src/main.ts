import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import logger from './utils/logger';
import { AppModule } from './app.module';
import config from './config';

(async () => {
  try {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix(config.server.endointsPrefix);
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(config.server.port, () => {
      logger.log(`app listening on port ${config.server.port}`);
    });
  } catch (error) {
    logger.error(error);
  }
})();
