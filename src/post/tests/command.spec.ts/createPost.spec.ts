import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import PostEntity from '../../../db/entities/Post';
import CategoryEntity from '../../../db/entities/Categories';

import { CreatePostHandler } from '../../commands/handlers/createPostHandler';
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

  it('should create post', async () => {
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

    const result = await createPostHandler.execute(createPostParams);
    expect(result).toHaveProperty('content');
    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('category');
    expect(result).toHaveProperty('categories');
  });

  it('check create post handler & create new post category', async () => {
    jest
      .spyOn(categoryRepository, 'findOne')
      .mockImplementation(() => Promise.resolve(null));

    const createPostParams = {
      postDto: {
        content: 'post content',
        postId: 1,
        title: 'post title',
        category: 'post category',
        categories: ['football'],
      },
      userDto: {},
    };
    const result = await createPostHandler.execute(createPostParams);
    expect(result).toHaveProperty('content');
    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('category');
    expect(result).toHaveProperty('categories');
  });

  it('should throw error ', async () => {
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

    await createPostHandler.execute(createPostParams).catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBeDefined();
    });
  });
});
