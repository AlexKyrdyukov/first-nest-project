import { HttpException } from '@nestjs/common';
import { AddressRepositoryFake } from '../../../auth/tests/fakeRepositories/FakeAddressRepository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { PatchDataHandler } from '../../commands/handlers/patchDataHandler';
import UserEntity from '../../../db/entities/User';
import AddressEntity from '../../../db/entities/Address';
import { UserRepositoryFake } from '../../../auth/tests/fakeRepositories/FakeUserRepository';

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
  });

  it('check update data if func throw error', async () => {
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
    try {
      await patchDataHandler.execute(patchHandlerParams);
    } catch (error) {
      expect(error.message).toBeDefined();
      expect(error).toBeInstanceOf(HttpException);
    }
  });
});
