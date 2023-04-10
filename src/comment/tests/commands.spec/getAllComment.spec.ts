import { HttpException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import PostEntity from '../../../db/entities/Post';

import { GetAllCommentHandler } from '../../../comment/query/handlers/getAllHandler';
import { PostRepositoryFake } from '../../../../tests/fakeAppRepo/fakePostRepoitory';

describe('check get all comment handler', () => {
  let getAllComment: GetAllCommentHandler;
  let postRepository: PostRepositoryFake;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllCommentHandler,
        {
          provide: getRepositoryToken(PostEntity),
          useClass: PostRepositoryFake,
        },
      ],
    }).compile();
    getAllComment = module.get(GetAllCommentHandler);
    postRepository = module.get(getRepositoryToken(PostEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('should pass succesfully & return post with comment', async () => {
    const params = {
      getAllCommentDto: {
        postId: 11,
      },
    };
    const result = await getAllComment.execute(params);
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('postId');
    expect(result).toHaveProperty('comments');
    expect(result).toHaveProperty('content');
  });

  it('should throw error not found post', async () => {
    const params = {
      getAllCommentDto: {
        postId: 11,
      },
    };
    jest
      .spyOn(postRepository, 'findOne')
      .mockImplementation(() => Promise.resolve(null));
    await getAllComment.execute(params).catch((err) => {
      expect(err).toBeInstanceOf(HttpException);
      expect(err.status).toBe(400);
      expect(err.message).toContain('This post not found');
    });
  });

  it('should throw error not found post', async () => {
    const params = {
      getAllCommentDto: {
        postId: '' as unknown as number,
      },
    };
    await getAllComment.execute(params).catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.status).toBeDefined();
      expect(err.message).toBeDefined();
    });
  });
});
