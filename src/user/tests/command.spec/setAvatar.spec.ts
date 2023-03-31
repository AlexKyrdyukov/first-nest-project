import { HttpException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import UserEntity from '../../../db/entities/User';
import { SetAvatarHandler } from '../../../user/commands/handlers/setAvatarhandler';
import { UserRepositoryFake } from '../../../auth/tests/fakeRepositories/FakeUserRepository';

describe('check set avatar handler', () => {
  let setAvatarHandler: SetAvatarHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SetAvatarHandler,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: UserRepositoryFake,
        },
      ],
    }).compile();
    setAvatarHandler = module.get(SetAvatarHandler);
  });

  it('check set avatar handler succesfull', async () => {
    const handlerParams = {
      avatarLink: 'link on avatar',
      userDto: {} as UserEntity,
    };
    const res = await setAvatarHandler.execute(handlerParams);
    expect(res).toStrictEqual({
      userId: 1,
      email: 'user@mail.com',
      fullName: 'Ivan Ivanov',
    });
  });

  it('check set avatar if handler throw error', async () => {
    const handlerParams = {
      avatarLink: null as unknown as string,
      userDto: null as unknown as UserEntity,
    };
    try {
      await setAvatarHandler.execute(handlerParams);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBeDefined();
    }
  });
});
