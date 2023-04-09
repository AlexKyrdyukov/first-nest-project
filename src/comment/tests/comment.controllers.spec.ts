import * as request from 'supertest';
import { Repository } from 'typeorm';
import { CommandBus } from '@nestjs/cqrs';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import RedisService from '../../redis/service';
import TokenService from '../../token/service';

import { AuthGuard } from './../../auth/authGuard';
import { CommentControllers } from '../controllers';

import UserEntity from '../../db/entities/User';
import { UserRepositoryFake } from '../../../tests/fakeAppRepo/FakeUserRepository';

describe('should check comment controller', () => {
  let app: INestApplication;
  let tokenService: TokenService;
  let userRepository: Repository<UserEntity>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentControllers],
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

  it('should throw error auth guard create/comment', async () => {
    const response = await request(app.getHttpServer())
      .post('/comment/create')
      .set({ authorization: 'Unknown token' })
      .send({});
    expect(response.status).toBe(401);
    expect(response.text).toContain(
      'Unknown type authorization, please enter in application & repeat request',
    );
  });

  it('should throw error validation pipe create/ comment', async () => {
    jest
      .spyOn(tokenService, 'verifyToken')
      .mockResolvedValue({ userId: 22 as never });

    const response = await request(app.getHttpServer())
      .post('/comment/create')
      .set({ authorization: 'Bearer token' })
      .send({});
    expect(response.status).toBe(400);
    expect(response.text).toContain(
      'content must be longer than or equal to 2 characters',
    );
    expect(response.text).toContain(
      'content must be shorter than or equal to 1000 characters',
    );
    expect(response.text).toContain('postId must be an integer number');
  });

  it('should pass, and call func create comment', async () => {
    jest
      .spyOn(tokenService, 'verifyToken')
      .mockResolvedValue({ userId: 22 as never });

    const response = await request(app.getHttpServer())
      .post('/comment/create')
      .set({ authorization: 'Bearer token' })
      .send({
        content: 'Comment content',
        postId: 2,
      });
    expect(response.status).toBe(201);
    expect(response.text).toContain('true');
  });
});
