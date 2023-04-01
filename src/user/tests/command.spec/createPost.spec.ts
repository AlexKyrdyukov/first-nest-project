import { HttpException } from '@nestjs/common';
import { CategoryRepositoryFake } from '../../../../tests/fakeAppRepo/fakeCategoryRepository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePostHandler } from '../../../user/commands/handlers/createPostHandler';
import PostEntity from '../../../db/entities/Post';
import { PostRepositoryFake } from '../../../../tests/fakeAppRepo/fakePostRepoitory';
import CategoryEntity from '../../../db/entities/Categories';

describe('check create post handler', () => {
  let createPostHandler: CreatePostHandler;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePostHandler,
        {
          provide: getRepositoryToken(PostEntity),
          useClass: PostRepositoryFake,
        },
        {
          provide: getRepositoryToken(CategoryEntity),
          useClass: CategoryRepositoryFake,
        },
      ],
    }).compile();
    createPostHandler = module.get(CreatePostHandler);
  });

  it('check create post handler', async () => {
    const createPostParams = {
      postDto: {
        content: 'post content',
        postId: 1,
        title: 'post title',
        category: 'post category',
        categories: [],
      },
      userDto: {},
    };

    const res = await createPostHandler.execute(createPostParams);
    expect(res).toStrictEqual({
      post: {
        postId: 1,
        content: 'post content',
        title: 'post title',
        comments: [],
      },
    });
  });

  it('check create post if throw error', async () => {
    const createPostParams = {
      postDto: {
        content: 'post content',
        postId: null,
        title: 'post title',
        category: 'post category',
        categories: [],
      },
      userDto: {},
    };

    try {
      await createPostHandler.execute(createPostParams);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBeDefined();
    }
  });
});
