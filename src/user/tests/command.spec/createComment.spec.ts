import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateCommentHandler } from '../../../user/commands/handlers/createCommentHandler';
import { UserRepositoryFake } from '../../../auth/tests/FakeUserRepository';
import { CommentRepositoryFake } from '../fakeRepositories/fakeCommentRepositories';
import CommentEntity from '../../../db/entities/Comment';
import PostEntity from '../../../db/entities/Post';
import { PostRepositoryFake } from '../fakeRepositories/fakePostRepoitory';

describe('check create comment handler', () => {
  let createComment: CreateCommentHandler;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCommentHandler,
        {
          provide: getRepositoryToken(CommentEntity),
          useValue: CommentRepositoryFake,
        },
        {
          provide: getRepositoryToken(PostEntity),
          useValue: PostRepositoryFake,
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
        // createdDate: '3/7/2022, 4:11:58 PM' as Date, // '123', // as unknown as Date,
        // updatedDate: '123' as unknown as Date,
        // deletedDate: '123' as unknown as Date,
        // posts: ['post'],
        // comment: ['comments'],
        // roles: ['roles'],
        avatar: 'avatar',
        // address: {
        //   country: 'Russia',
        //   city: 'Moscow',
        //   street: 'Petrovskaya',
        // },
      },
    };
    const res = await createComment.execute(handlerParams);
    expect(res).toBeDefined();
  });
});
