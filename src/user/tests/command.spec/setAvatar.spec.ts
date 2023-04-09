import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import UserEntity from '../../../db/entities/User';

import { SetAvatarHandler } from '../../../user/commands/handlers/setAvatarhandler';
import { UserRepositoryFake } from '../../../../tests/fakeAppRepo/FakeUserRepository';

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('should pass succesfully & returned updated user', async () => {
    const handlerParams = {
      avatarLink: 'link on avatar',
      userDto: {} as UserEntity,
    };
    const result = await setAvatarHandler.execute(handlerParams);
    expect(result).toBeTruthy();
    expect(result).toHaveProperty('email');
    expect(result).toHaveProperty('address');
    expect(result).toHaveProperty('roles');
    expect(result).toHaveProperty('userId');
  });

  it('should throw error', async () => {
    const handlerParams = {
      avatarLink: null as unknown as string,
      userDto: null as unknown as UserEntity,
    };
    await setAvatarHandler.execute(handlerParams).catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBeDefined();
    });
  });
});
