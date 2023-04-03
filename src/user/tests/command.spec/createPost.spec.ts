import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import PostEntity from '../../../db/entities/Post';
import CategoryEntity from '../../../db/entities/Categories';

import { CreatePostHandler } from '../../../user/commands/handlers/createPostHandler';
import { PostRepositoryFake } from '../../../../tests/fakeAppRepo/fakePostRepoitory';
import { CategoryRepositoryFake } from '../../../../tests/fakeAppRepo/fakeCategoryRepository';

describe('check create post handler', () => {
  let createPostHandler: CreatePostHandler;
  let categoryRepository: CategoryRepositoryFake;
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
    categoryRepository = module.get(getRepositoryToken(CategoryEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('check create post handler', async () => {
    const createPostParams = {
      postDto: {
        content: 'post content',
        postId: 1,
        title: 'post title',
        category: 'football',
        categories: ['footbal'],
      },
      userDto: {},
    };

    const res = await createPostHandler.execute(createPostParams);
    expect(res).toHaveProperty('content');
    expect(res).toHaveProperty('title');
    expect(res).toHaveProperty('category');
    expect(res).toHaveProperty('categories');
  });

  it('check create post handler if create new post category', async () => {
    jest
      .spyOn(categoryRepository, 'findOne')
      .mockImplementation(() => Promise.resolve(null));

    const createPostParams = {
      postDto: {
        content: 'post content',
        postId: 1,
        title: 'post title',
        category: 'post category',
        categories: ['footbal'],
      },
      userDto: {},
    };
    const res = await createPostHandler.execute(createPostParams);
    expect(res).toHaveProperty('content');
    expect(res).toHaveProperty('title');
    expect(res).toHaveProperty('category');
    expect(res).toHaveProperty('categories');
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
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBeDefined();
    }
  });
});
