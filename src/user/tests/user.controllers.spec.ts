import { AuthGuard } from './../../auth/authGuard';
import RedisService from '../../redis/service';
import TokenService from '../../token/service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import UserEntity from '../../db/entities/User';
import { UserControllers } from '../controllers';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepositoryFake } from '../../../tests/fakeAppRepo/FakeUserRepository';
import { CommandBus } from '@nestjs/cqrs';
import { Repository } from 'typeorm';

describe('should check work useer controller', () => {
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
    const res = await request(app.getHttpServer())
      .delete('/user/:22')
      .set({ authorization: 'Bearer token' })
      .expect(200);
    expect(res.text).toContain('true');
  });

  it('should throw error auth guard /delete "Please authorization in application"', async () => {
    jest
      .spyOn(tokenService, 'verifyToken')
      .mockResolvedValue({ userId: 22 as never });

    const res = await request(app.getHttpServer())
      .delete('/user/:22')
      .expect(401);
    expect(res.text).toContain('Please authorization in application');
  });

  it('should throw error auth guard /delete "Unknown type authorization, please enter in application & repeat reques"', async () => {
    const res = await request(app.getHttpServer())
      .delete('/user/:22')
      .set({ authorization: 'Unknown token' })
      .expect(401);
    expect(res.text).toContain(
      'Unknown type authorization, please enter in application & repeat reques',
    );
  });

  it('should throw error authGuard /patch/password "Please authorization in application"', async () => {
    const res = await request(app.getHttpServer())
      .patch('/user/:22/password')
      .expect(401);
    expect(res.text).toContain('Please authorization in application');
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

    const res = await request(app.getHttpServer())
      .patch('/user/:22/password')
      .set({ authorization: 'Bearer token' })
      .expect(400);
    expect(res.text).toContain('password must be a string');
    expect(res.text).toContain('newPassword must be a string');
  });

  it('should throw error authGuard, route patch/userData', async () => {
    const res = await request(app.getHttpServer())
      .patch('/user/:22')
      .set({ authorization: 'Unknown token' })
      .expect(401);
    expect(res.text).toContain(
      'Unknown type authorization, please enter in application & repeat request',
    );
  });

  it('should throw error validation pipe route patch/userData', async () => {
    jest
      .spyOn(tokenService, 'verifyToken')
      .mockResolvedValue({ userId: 22 as never });

    const res = await request(app.getHttpServer())
      .patch('/user/:22')
      .send({})
      .set({ authorization: 'Bearer token' })
      .expect(400);
    expect(res.text).toContain(
      'email must be longer than or equal to 3 characters',
    );
    expect(res.text).toContain(
      'fullName must be longer than or equal to 2 characters',
    );
    expect(res.text).toContain('address should not be null or undefined');
  });

  it('should pass, and call func change user data', async () => {
    jest
      .spyOn(tokenService, 'verifyToken')
      .mockResolvedValue({ userId: 22 as never });

    const res = await request(app.getHttpServer())
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
      .set({ authorization: 'Bearer token' })
      .expect(200);
    expect(res.text).toContain('true');
  });

  it('should throw error auth guard user/avatar', async () => {
    const res = await request(app.getHttpServer())
      .post('/user/:22/avatar')
      .set({ authorization: 'Unknown token' })
      .send({})
      .expect(401);
    expect(res.text).toContain(
      'Unknown type authorization, please enter in application & repeat request',
    );
  });

  it('should throw error validation pipe user/avaatar', async () => {
    jest
      .spyOn(tokenService, 'verifyToken')
      .mockResolvedValue({ userId: 22 as never });

    const res = await request(app.getHttpServer())
      .post('/user/:22/avatar')
      .set({ authorization: 'Bearer token' })
      .send({})
      .expect(400);
    expect(res.text).toContain('avatar should not be empty');
    expect(res.text).toContain('must be only string');
  });

  it('should pass, and call func update user avatar', async () => {
    jest
      .spyOn(tokenService, 'verifyToken')
      .mockResolvedValue({ userId: 22 as never });

    const res = await request(app.getHttpServer())
      .post('/user/:22/avatar')
      .set({ authorization: 'Bearer token' })
      .send({
        avatar: 'userAvatar',
      })
      .expect(200);
    expect(res.text).toContain('true');
  });
});
