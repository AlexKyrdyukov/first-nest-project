import { AuthModule } from './../module';
import { CommandBus } from '@nestjs/cqrs';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import TokenService from '../../token/service';
import AuthController from '../controllers';
import RedisService from '../../redis/service';
import UserEntity from '../../db/entities/User';
import { signUpUserData } from '../../../tests/fakeAppData/userData/signUpData';
import { UserRepositoryFake } from '../../../tests/fakeAppRepo/FakeUserRepository';

describe('check auth controllers', () => {
  let app: INestApplication;
  let tokenService: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthModule,
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

  it('should pass sign-in validation entered data, ', async () => {
    await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        headers: {
          deviceId: '12345',
        },
        email: 'user@mail.com',
        password: '123',
      })
      .expect(200);
  });

  it('should throw error validation sign-in', async () => {
    await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({})
      .expect(400);
  });

  it('should pass sign-in validation entered data', async () => {
    const { signUpDto, deviceId } = signUpUserData;
    await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({
        ...signUpDto,
      })
      .expect(201);
  });

  it('should throw error validation sign-up', async () => {
    await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({})
      .expect(400);
  });

  it('should throw error authorization get-me', async () => {
    await request(app.getHttpServer())
      .get('/auth/me')
      .set({ authorization: '' })
      .expect(401);
  });

  it('should throw error authorization get-me', async () => {
    await request(app.getHttpServer())
      .get('/auth/me')
      .set({ authorization: 'Unknown token' })
      .expect(401);
  });

  it('should throw error authorization get-me', async () => {
    await request(app.getHttpServer())
      .get('/auth/me')
      .set({ authorization: 'Bearer token' })
      .expect(401);
  });

  it('should pass 200 ok get-me', async () => {
    jest
      .spyOn(tokenService, 'verifyToken')
      .mockResolvedValue({ userId: 2 as never });

    await request(app.getHttpServer())
      .get('/auth/me')
      .set({ authorization: 'Bearer token' })
      .expect(200);
  });

  it('should throw error validation refresh', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({})
      .expect(400);
  });

  it('should throw error validation refresh', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({
        refreshToken: 'Bearer token',
      })
      .expect(201);
  });
});
