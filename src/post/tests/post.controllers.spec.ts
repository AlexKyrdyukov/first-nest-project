import { AuthGuard } from '../../auth/authGuard';
import RedisService from '../../redis/service';
import TokenService from '../../token/service';
import {
  INestApplication,
  ValidationPipe,
  HttpException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import UserEntity from '../../db/entities/User';
import { PostControllers } from '../controllers';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepositoryFake } from '../../../tests/fakeAppRepo/FakeUserRepository';
import { CommandBus } from '@nestjs/cqrs';
import { Repository } from 'typeorm';

describe('should check work post controller', () => {
  let app: INestApplication;
  let tokenService: TokenService;
  let userRepository: Repository<UserEntity>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostControllers],
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

  it('should throw error auth guard create/post', async () => {
    const response = await request(app.getHttpServer())
      .post('/post/create')
      .set({ authorization: 'Unknown token' })
      .send({});
    expect(response.error).toBeInstanceOf(Error);
    expect(response.status).toBe(401);
    expect(response.text).toContain(
      'Unknown type authorization, please enter in application & repeat request',
    );
  });

  it('should throw error validation pipe create/post', async () => {
    jest
      .spyOn(tokenService, 'verifyToken')
      .mockResolvedValue({ userId: 22 as never });

    const response = await request(app.getHttpServer())
      .post('/post/create')
      .set({ authorization: 'Bearer token' })
      .send({});
    expect(response.error).toBeInstanceOf(Error);
    expect(response.status).toBe(400);
    expect(response.text).toContain(
      'content must be longer than or equal to 2 characters',
    );
    expect(response.text).toContain(
      'title must be shorter than or equal to 100 characters',
    );
  });

  it('should pass authGuard, validation & call func create post', async () => {
    jest
      .spyOn(tokenService, 'verifyToken')
      .mockResolvedValue({ userId: 22 as never });

    const response = await request(app.getHttpServer())
      .post('/post/create')
      .set({ authorization: 'Bearer token' })
      .send({
        content: 'Post content',
        title: 'Post title',
        category: 'soccer',
        categories: ['football'],
      });
    expect(response.status).toBe(201);
    expect(response.text).toContain('true');
  });
});
