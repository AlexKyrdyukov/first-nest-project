import { HttpException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import PostEntity from '../../../db/entities/Post';
import CommentEntity from '../../../db/entities/Comment';

import { CreateCommentHandler } from '../../commands/handlers/createCommentHandler';
import { CommentRepositoryFake } from '../../../../tests/fakeAppRepo/fakeCommentRepositories';
import { PostRepositoryFake } from '../../../../tests/fakeAppRepo/fakePostRepoitory';

describe('check create comment handler', () => {
  let createComment: CreateCommentHandler;
  let postRepository: PostRepositoryFake;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCommentHandler,
        {
          provide: getRepositoryToken(CommentEntity),
          useClass: CommentRepositoryFake,
        },
        {
          provide: getRepositoryToken(PostEntity),
          useClass: PostRepositoryFake,
        },
      ],
    }).compile();
    createComment = module.get(CreateCommentHandler);
    postRepository = module.get(getRepositoryToken(PostEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('should pass handler & return post with comment', async () => {
    const handlerParams = {
      createCommentDto: {
        content: 'text comment',
        postId: 3,
      },
      userDto: {
        userId: 2,
        email: 'user@mail.ru',
        password: '123',
        fullName: 'name',
        avatar: 'avatar',
      },
    };
    const result = await createComment.execute(handlerParams);
    expect(result).toHaveProperty('post');
    expect(result).toBeTruthy();
  });

  it('should throw error post not found', async () => {
    const handlerParams = {
      createCommentDto: {
        content: 'text comment',
        postId: 3,
      },
      userDto: {
        userId: 2,
        email: 'user@mail.ru',
        password: '123',
        fullName: 'name',
        avatar: 'avatar',
      },
    };

    jest.spyOn(postRepository, 'findOne').mockResolvedValue(null);
    await createComment.execute(handlerParams).catch((err) => {
      expect(err).toBeInstanceOf(HttpException);
      expect(err.status).toBe(400);
      expect(err.message).toBe(
        'This post not found please check data & repeat request',
      );
    });
  });

  it('should throw error Error', async () => {
    const handlerParams = {
      createCommentDto: {
        content: 'text comment',
        postId: 3,
      },
      userDto: {
        userId: 2,
        email: 'user@mail.ru',
        password: '123',
        fullName: 'name',
        avatar: 'avatar',
      },
    };
    await createComment.execute(handlerParams).catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBeDefined();
    });
  });
});
