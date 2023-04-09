import * as request from 'supertest';
import { Repository } from 'typeorm';
import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  HttpException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import UserEntity from '../../db/entities/User';
import { AuthGuard } from './../../auth/authGuard';

import RedisService from '../../redis/service';
import TokenService from '../../token/service';

import { UserControllers } from '../controllers';
import { UserRepositoryFake } from '../../../tests/fakeAppRepo/FakeUserRepository';

describe('should check work user controllers', () => {
  let app: INestApplication;
  let tokenService: TokenService;
  let userRepository: Repository<UserEntity>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserControllers],
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
    userRepository = module.get(getRepositoryToken(UserEntity));
    app.useGlobalGuards(new AuthGuard(tokenService, userRepository));
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
    app.close();
  });

  it('should pass and call func delete', async () => {
    jest
      .spyOn(tokenService, 'verifyToken')
      .mockResolvedValue({ userId: 22 as never });
    const response = await request(app.getHttpServer())
      .delete('/user/:22')
      .set({ authorization: 'Bearer token' });
    expect(response.status).toBe(200);
    expect(response.text).toContain('true');
  });

  it('should throw error auth guard /delete "Please authorization in application"', async () => {
    jest
      .spyOn(tokenService, 'verifyToken')
      .mockResolvedValue({ userId: 22 as never });

    const response = await request(app.getHttpServer()).delete('/user/:22');
    expect(response.error).toBeInstanceOf(Error);
    expect(response.status).toBe(401);
    expect(response.text).toContain('Please authorization in application');
  });

  it('should throw error auth guard /delete "Unknown type authorization, please enter in application & repeat reques"', async () => {
    const response = await request(app.getHttpServer())
      .delete('/user/:22')
      .set({ authorization: 'Unknown token' });
    expect(response.error).toBeInstanceOf(Error);
    expect(response.status).toBe(401);
    expect(response.text).toContain(
      'Unknown type authorization, please enter in application & repeat reques',
    );
  });

  it('should throw error authGuard /patch/password "Please authorization in application"', async () => {
    const response = await request(app.getHttpServer()).patch(
      '/user/:22/password',
    );
    expect(response.error).toBeInstanceOf(Error);
    expect(response.status).toBe(401);
    expect(response.text).toContain('Please authorization in application');
  });

  it('should pass, and call function updated password', async () => {
    jest
      .spyOn(tokenService, 'verifyToken')
      .mockResolvedValue({ userId: 22 as never });

    await request(app.getHttpServer())
      .patch('/user/:22/password')
      .send({
        password: '123',
        newPassword: '124',
      })
      .set({ authorization: 'Bearer token.' })
      .expect(204);
  });

  it('should throw error validation entered data route patch/password', async () => {
    jest
      .spyOn(tokenService, 'verifyToken')
      .mockResolvedValue({ userId: 22 as never });

    const response = await request(app.getHttpServer())
      .patch('/user/:22/password')
      .set({ authorization: 'Bearer token' });

    expect(response.status).toBe(400);
    expect(response.error).toBeInstanceOf(Error);
    expect(response.text).toContain('password must be a string');
    expect(response.text).toContain('newPassword must be a string');
  });

  it('should throw error authGuard, route patch/userData', async () => {
    const response = await request(app.getHttpServer())
      .patch('/user/:22')
      .set({ authorization: 'Unknown token' });
    expect(response.status).toBe(401);
    expect(response.error).toBeInstanceOf(Error);
    expect(response.text).toContain(
      'Unknown type authorization, please enter in application & repeat request',
    );
  });

  it('should throw error validation pipe route patch/userData', async () => {
    jest
      .spyOn(tokenService, 'verifyToken')
      .mockResolvedValue({ userId: 22 as never });

    const response = await request(app.getHttpServer())
      .patch('/user/:22')
      .send({})
      .set({ authorization: 'Bearer token' });
    expect(response.status).toBe(400);
    expect(response.error).toBeInstanceOf(Error);
    expect(response.text).toContain(
      'email must be longer than or equal to 3 characters',
    );
    expect(response.text).toContain(
      'fullName must be longer than or equal to 2 characters',
    );
    expect(response.text).toContain('address should not be null or undefined');
  });

  it('should pass, and call func change user data', async () => {
    jest
      .spyOn(tokenService, 'verifyToken')
      .mockResolvedValue({ userId: 22 as never });

    const response = await request(app.getHttpServer())
      .patch('/user/:22')
      .send({
        email: 'user@mail.com',
        fullName: 'Ivan Ivanov',
        address: {
          country: 'Russia',
          city: 'Moscow',
          street: 'Petrovskaya',
        },
      })
      .set({ authorization: 'Bearer token' });
    expect(response.status).toBe(200);
    expect(response.text).toContain('true');
  });

  it('should throw error auth guard user/avatar', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/:22/avatar')
      .set({ authorization: 'Unknown token' })
      .send({});
    expect(response.error).toBeInstanceOf(Error);
    expect(response.status).toBe(401);
    expect(response.text).toContain(
      'Unknown type authorization, please enter in application & repeat request',
    );
  });

  it('should throw error validation pipe user/avaatar', async () => {
    jest
      .spyOn(tokenService, 'verifyToken')
      .mockResolvedValue({ userId: 22 as never });

    const response = await request(app.getHttpServer())
      .post('/user/:22/avatar')
      .set({ authorization: 'Bearer token' })
      .send({});
    expect(response.error).toBeInstanceOf(Error);
    expect(response.status).toBe(400);
    expect(response.text).toContain('avatar should not be empty');
    expect(response.text).toContain('must be only string');
  });

  it('should pass, and call func update user avatar', async () => {
    jest
      .spyOn(tokenService, 'verifyToken')
      .mockResolvedValue({ userId: 22 as never });

    const response = await request(app.getHttpServer())
      .post('/user/:22/avatar')
      .set({ authorization: 'Bearer token' })
      .send({
        avatar: 'userAvatar',
      });
    expect(response.status).toBe(200);
    expect(response.text).toBeTruthy();
    expect(response.text).toContain('true');
  });
});
