import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import PostEntity from '../../../db/entities/Post';

import { PostRepositoryFake } from '../../../../tests/fakeAppRepo/fakePostRepoitory';
import { GetAllPostHandler } from '../../../post/query/handlers/getAllHandler';
import { HttpException } from '@nestjs/common';

describe('check create post handler', () => {
  let getAllPostHandler: GetAllPostHandler;
  let postRepository: PostRepositoryFake;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllPostHandler,
        {
          provide: getRepositoryToken(PostEntity),
          useClass: PostRepositoryFake,
        },
      ],
    }).compile();

    getAllPostHandler = module.get(GetAllPostHandler);
    postRepository = module.get(getRepositoryToken(PostEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('should pass succesfully & rerurn posts with total count posts', async () => {
    const params = {
      getAllPostDto: {
        userId: 11,
      },
    };
    const result = await getAllPostHandler.execute(params);
    expect(result).toHaveProperty('posts');
    expect(result).toHaveProperty('count');
    expect(result.count).toBeGreaterThan(0);
    expect(result.posts.length).toBeGreaterThan(0);
  });

  it('should throw error That user havent posts', async () => {
    const params = {
      getAllPostDto: {
        userId: 11,
      },
    };
    jest
      .spyOn(postRepository, 'findAndCount')
      .mockImplementation(() => Promise.resolve([[], 0]));
    await getAllPostHandler.execute(params).catch((err) => {
      expect(err).toBeInstanceOf(HttpException);
      expect(err.status).toBe(400);
      expect(err.message).toContain('That user havent posts');
    });
  });
});
