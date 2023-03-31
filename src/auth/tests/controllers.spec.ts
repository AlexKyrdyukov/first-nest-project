import { SignInUserHandler } from './../commands/handlers/signInUserHandler';
import { SignInUserCommand } from './../commands/implementations/signInUserCommand';
import { CommandBus, QueryBus, EventPublisher, EventBus } from '@nestjs/cqrs';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMock } from '@golevelup/ts-jest';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import AuthController from '../controllers';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import TokenService from '../../token/service';
import RedisService from '../../redis/service';
import UserEntity from '../../db/entities/User';
import { UserRepositoryFake } from './fakeRepositories/FakeUserRepository';
import RedisClient from '@redis/client/dist/lib/client';
import CryptoService from '../../crypto/service';

describe('check user repository', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: CommandBus,
          useValue: { execute: () => { } },
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
      controllers: [AuthController],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('check sign in controller', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        headers: {
          deviceId: '1111111111111',
        },
        email: 'user@mail.com',
        password: '123',
      })
      .expect(200);
  });

  it('check sign up controller', async () => {
    const res = await request(app.getHttpServer()).post('/auth/sign-up').send({
      usr: 'dddddd',
    });
    // .expect(201)
    // .expect({});
    console.log('11111111111', res.error);
  });
});
