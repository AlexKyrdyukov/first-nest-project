import { signUpUserData } from './../../../tests/fakeAppData/userData/signUpData';
import { CommandBus } from '@nestjs/cqrs';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import AuthController from '../controllers';
import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import TokenService from '../../token/service';
import RedisService from '../../redis/service';
import UserEntity from '../../db/entities/User';
import { UserRepositoryFake } from '../../../tests/fakeAppRepo/FakeUserRepository';

describe('check user repository', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      controllers: [AuthController],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('should pass validation entered data, ', async () => {
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
    console.log(res.error);
  });

  it('should throw error validation', async () => {
    try {
      const res = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({})
        .expect(400);
      console.log(6111, res.error);
    } catch (error) {
      console.log(6111, error);
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBeDefined();
    }
  });

  it('should pass validation entered data', async () => {
    const { signUpDto, deviceId } = signUpUserData;
    const res = await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({
        ...signUpDto,
      });
    // .expect(201)
    // .expect({});
    console.log('11111111111', res.error);
  });
});
