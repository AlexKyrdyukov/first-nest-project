import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

import logger from './utils/logger';

import { AppModule } from './app.module';
import { appMiddleware } from './app.middleware';
import config from './config';

(async () => {
  try {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix(config.server.endointsPrefix);
    app.useGlobalPipes(new ValidationPipe());
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Pokemon server application')
      .setDescription('Documentation REST API')
      .setVersion('0.0.1')
      .addTag('produced by Alexey Kurilov')
      .build();
    const options: SwaggerDocumentOptions = {
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
    };
    const document = SwaggerModule.createDocument(app, swaggerConfig, options);
    SwaggerModule.setup('/api/docs', app, document);
    await app.listen(config.server.port, () => {
      logger.log(`app listening on port ${config.server.port}`);
    });
    app.use(appMiddleware);
  } catch (error) {
    logger.error(error);
  }
})();
