import { CommentControllers } from '../controllers';
import { AuthGuard } from './../../auth/authGuard';
import RedisService from '../../redis/service';
import TokenService from '../../token/service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import UserEntity from '../../db/entities/User';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepositoryFake } from '../../../tests/fakeAppRepo/FakeUserRepository';
import { CommandBus } from '@nestjs/cqrs';
import { RolesGuard } from '../../roles/rolesGuard';
import { Repository } from 'typeorm';

describe('should check work useer controller', () => {
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
    const res = await request(app.getHttpServer())
      .post('/comment/create')
      .set({ authorization: 'Unknown token' })
      .send({})
      .expect(401);
    expect(res.text).toContain(
      'Unknown type authorization, please enter in application & repeat request',
    );
  });

  it('should throw error validation pipe create/ comment', async () => {
    jest
      .spyOn(tokenService, 'verifyToken')
      .mockResolvedValue({ userId: 22 as never });

    const res = await request(app.getHttpServer())
      .post('/comment/create')
      .set({ authorization: 'Bearer token' })
      .send({})
      .expect(400);
    expect(res.text).toContain(
      'content must be longer than or equal to 2 characters',
    );
    expect(res.text).toContain(
      'content must be shorter than or equal to 1000 characters',
    );
    expect(res.text).toContain('postId must be an integer number');
  });

  it('should pass, and call func create comment', async () => {
    jest
      .spyOn(tokenService, 'verifyToken')
      .mockResolvedValue({ userId: 22 as never });

    const res = await request(app.getHttpServer())
      .post('/comment/create')
      .set({ authorization: 'Bearer token' })
      .send({
        content: 'Comment content',
        postId: 2,
      })
      .expect(201);
    expect(res.text).toContain('true');
  });
});
