import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import UserEntity from '../../../db/entities/User';
import AddressEntity from '../../../db/entities/Address';

import { RemoveUserHandler } from '../../../user/commands/handlers/removeUserHandler';
import { UserRepositoryFake } from '../../../../tests/fakeAppRepo/FakeUserRepository';
import { AddressRepositoryFake } from '../../../../tests/fakeAppRepo/FakeAddressRepository';

describe('check handler delete user', () => {
  let removeUserHandler: RemoveUserHandler;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemoveUserHandler,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: UserRepositoryFake,
        },
        {
          provide: getRepositoryToken(AddressEntity),
          useClass: AddressRepositoryFake,
        },
      ],
    }).compile();
    removeUserHandler = module.get(RemoveUserHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('should delete user', async () => {
    const handlerParams = {
      userDto: {} as UserEntity,
    };

    const res = await removeUserHandler.execute(handlerParams);
    expect(res).toBeUndefined();
  });

  it('should throw error', async () => {
    const handlerParams = {
      userDto: {} as UserEntity,
    };
    await removeUserHandler.execute(handlerParams).catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBeDefined();
    });
  });
});
