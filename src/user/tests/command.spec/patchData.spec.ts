import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import UserEntity from '../../../db/entities/User';
import AddressEntity from '../../../db/entities/Address';

import { PatchDataHandler } from '../../commands/handlers/patchDataHandler';
import { UserRepositoryFake } from '../../../../tests/fakeAppRepo/FakeUserRepository';
import { AddressRepositoryFake } from '../../../../tests/fakeAppRepo/FakeAddressRepository';

describe('check handler update user data', () => {
  let patchDataHandler: PatchDataHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatchDataHandler,
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
    patchDataHandler = module.get(PatchDataHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('should update user data & return updated user', async () => {
    const patchHandlerParams = {
      patchUserDto: {
        address: {
          country: 'Russia',
          city: 'Moscov',
          street: 'Petrovskaya',
        },
      },
      user: {
        fullName: 'Ivan Ivanov',
        email: 'user@mail.ru',
        password: '123',
      },
    };
    const result = await patchDataHandler.execute(patchHandlerParams);
    expect(result).not.toBeUndefined();
    expect(result).toBeDefined();
    expect(result).toHaveProperty('userId');
    expect(result).toHaveProperty('email');
    expect(result).toHaveProperty('address');
    expect(result).toHaveProperty('roles');
  });

  it('should throw error', async () => {
    const patchHandlerParams = {
      patchUserDto: {
        address: null as unknown as AddressEntity,
      },
      user: null as unknown as UserEntity,
    };
    await patchDataHandler.execute(patchHandlerParams).catch((err) => {
      expect(err.message).toBeDefined();
      expect(err).toBeInstanceOf(Error);
    });
  });
});
