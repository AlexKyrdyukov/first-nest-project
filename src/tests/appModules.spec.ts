import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import UserModule from '../user/module';
import { AppModule } from '../app.module';
import TokenModule from '../token/module';
import RedisModule from '../redis/module';
import CryptoModule from '../crypto/module';
import { AuthModule } from '../auth/module';
import redisProviders from '../redis/providers';
import { CommentModule } from '../comment/module';
import MainModule from '../../src/main';

describe('should test modules application', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'MAIN_MODULE',
          useFactory: async () => MainModule,
        },
        AuthModule,
        CryptoModule,
        UserModule,
        CommentModule,
        TokenModule,
        ...redisProviders,
        ConfigService,
        RedisModule,
        AppModule,
      ],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
    app.close();
  });

  it('should return true', async () => {
    expect(app).toBeDefined();
  });
});
