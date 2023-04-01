import { HttpException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateCommentHandler } from '../../../user/commands/handlers/createCommentHandler';
import { CommentRepositoryFake } from '../../../../tests/fakeAppRepo/fakeCommentRepositories';
import CommentEntity from '../../../db/entities/Comment';
import PostEntity from '../../../db/entities/Post';
import { PostRepositoryFake } from '../../../../tests/fakeAppRepo/fakePostRepoitory';

describe('check create comment handler', () => {
  let createComment: CreateCommentHandler;
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
