import RedisService from '../../redis/service';
import TokenService from '../../token/service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import UserEntity from '../../db/entities/User';
import UserController from '../controllers';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepositoryFake } from '../../../tests/fakeAppRepo/FakeUserRepository';
import { CommandBus } from '@nestjs/cqrs';

describe('should check work useer controller', () => {
  let app: INestApplication;
  let tokenService: TokenService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        TokenService,
        {
          provide: CommandBus,
          useValue: { execute: () => true },
        },
        {
          provide: RedisService,
          useValue: RedisService,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: UserRepositoryFake,
        },
      ],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    tokenService = module.get(TokenService);
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
    app.close();
  });

  it('should pass and call func ', async () => {
    jest
      .spyOn(tokenService, 'verifyToken')
      .mockResolvedValue({ userId: 22 as never });
    const res = await request(app.getHttpServer())
      .delete('/user/:22')
      .send({
        userId: 22,
      })
      .set({ authorization: 'Bearer token' })
      .expect(401);
    console.log(res.error);
  });
});
