import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import UserEntity from '../../../db/entities/User';
import AddressEntity from '../../../db/entities/Address';

import { AddressRepositoryFake } from '../../../../tests/fakeAppRepo/FakeAddressRepository';
import { PatchDataHandler } from '../../commands/handlers/patchDataHandler';
import { UserRepositoryFake } from '../../../../tests/fakeAppRepo/FakeUserRepository';

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

  it('check update user data', async () => {
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
    const res = await patchDataHandler.execute(patchHandlerParams);
    expect(res).toBeDefined();
    expect(res).toHaveProperty('userId');
    expect(res).toHaveProperty('email');
    expect(res).toHaveProperty('address');
    expect(res).toHaveProperty('roles');
  });

  it('check update data if func throw error', async () => {
    const patchHandlerParams = {
      patchUserDto: {
        address: null as unknown as AddressEntity,
      },
      user: null as unknown as UserEntity,
    };
    try {
      await patchDataHandler.execute(patchHandlerParams);
    } catch (error) {
      expect(error.message).toBeDefined();
      expect(error).toBeInstanceOf(Error);
    }
  });
});
