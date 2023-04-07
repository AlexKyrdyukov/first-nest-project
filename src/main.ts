import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

import config from './config';
import { AppModule } from './app.module';
import { appMiddleware } from './app.middleware';

export default (async () => {
  try {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix(config.server.endointsPrefix);
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Pokemon server application')
      .setDescription('Documentation REST API')
      .setVersion('0.0.1')
      .addTag('produced by Alexey Kurilov')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'Bearer',
        },
        'access-token',
      )
      .build();
    const options: SwaggerDocumentOptions = {
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
    };
    const document = SwaggerModule.createDocument(app, swaggerConfig, options);
    SwaggerModule.setup('/api/docs', app, document, {
      customfavIcon:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/35.png',
      customSiteTitle: 'My App documentation',
    });
    app.use(appMiddleware);
    await app.listen(config.server.port, () => {
      Logger.log(`app listening on port ${config.server.port}`);
    });
  } catch (error) {
    Logger.error(error);
  }
})();
