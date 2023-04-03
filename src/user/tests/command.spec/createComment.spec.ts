import { HttpException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import PostEntity from '../../../db/entities/Post';
import CommentEntity from '../../../db/entities/Comment';

import { CreateCommentHandler } from '../../../user/commands/handlers/createCommentHandler';
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

  it('check create comment handler', async () => {
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
    const res = await createComment.execute(handlerParams);
    expect(res).toStrictEqual({
      post: {
        postId: 1,
        content: 'post content',
        title: 'post title',
        comments: [],
      },
    });
  });

  it('check handler if post dont find', async () => {
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
    try {
      await createComment.execute(handlerParams);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('Unknown error please repeat request');
    }
  });

  it('check create comment handler if func throw error', async () => {
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
    try {
      await createComment.execute(handlerParams);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBeDefined();
    }
  });
});
