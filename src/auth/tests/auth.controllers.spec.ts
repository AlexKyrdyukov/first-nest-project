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
    const response = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        headers: {
          deviceId: '12345',
        },
        email: 'user@mail.com',
        password: '123',
      });
    expect(response.text).toBe('true');
    expect(response.status).toBe(200);
  });

  it('should throw error validation sign-in', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({})
      .expect(400);
    expect(response.text).toContain(
      'email must be longer than or equal to 3 characters',
    );
    expect(response.text).toContain(
      'must be no shorter than 3 characters and no longer than 11 characters',
    );
    expect(response.status).toBe(400);
  });

  it('should pass sign-in validation entered data', async () => {
    const { signUpDto, deviceId } = signUpUserData;
    const response = await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({
        ...signUpDto,
      });
    expect(response.text).toBe('true');
    expect(response.status).toBe(201);
  });

  it('should throw error validation sign-up', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({});
    expect(response.status).toBe(400);
    expect(response.text).toContain(
      'email must be shorter than or equal to 30 characters',
    );
    expect(response.text).toContain('password should not be empty');
  });

  it('should throw error authorization get-me', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set({ authorization: '' });
    expect(response.status).toBe(401);
    expect(response.text).toContain('Please authorization in application');
  });

  it('should throw error authorization get-me', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set({ authorization: 'Unknown token' });
    expect(response.status).toBe(401);
    expect(response.text).toContain(
      'Unknown type authorization, please enter in application & repeat request',
    );
  });

  it('should throw error authorization get-me', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set({ authorization: 'Bearer token' })
      .expect(401);
    expect(response.status).toBe(401);
    expect(response.text).toContain(
      'User unknown type authorized please sign in application',
    );
  });

  it('should pass 200 ok get-me & return user', async () => {
    jest
      .spyOn(tokenService, 'verifyToken')
      .mockResolvedValue({ userId: 2 as never });

    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set({ authorization: 'Bearer token' });
    expect(response.status).toBe(200);
    expect(response.text).toContain('userId');
    expect(response.text).toContain('address');
    expect(response.text).toContain('roles');
    expect(response.text).toContain('avatar');
  });

  it('should throw error validation refresh', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({});
    expect(response.status).toBe(400);
    expect(response.text).toContain('refreshToken should not be empty');
  });

  it('should create both tokens access & refresh', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({
        refreshToken: 'Bearer token',
      });
    expect(response.status).toBe(201);
    expect(response.text).toContain('true');
  });
});
