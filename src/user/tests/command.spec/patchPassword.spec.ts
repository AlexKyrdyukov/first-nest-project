import { HttpException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PatchPasswordHandler } from './../../commands/handlers/patchPasswordHandler';
import { Test, TestingModule } from '@nestjs/testing';
import UserEntity from '../../../db/entities/User';
import { UserRepositoryFake } from '../../../auth/tests/fakeRepositories/FakeUserRepository';
import CryptoService from '../../../crypto/service';

describe('test patch password handler', () => {
  let patchPasswordHandler: PatchPasswordHandler;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatchPasswordHandler,
        CryptoService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: UserRepositoryFake,
        },
      ],
    }).compile();
    patchPasswordHandler = module.get(PatchPasswordHandler);
  });

  it('check password handler when password valid', async () => {
    const handlerParams = {
      patchPasswordDto: {
        password: '123',
        newPassword: '124',
      },
      user: {
        password:
          'b7902eed0114afa8bc848c0f9fd8c7cd20f2eb67344e8702ba6adf59d6f45e3d137b851adbcf416fa1a3a2a949ca013ba2f3f9b4a7fc63a1f2aad1045ef732d4',
      } as UserEntity,
    };
    const res = await patchPasswordHandler.execute(handlerParams);
    expect(res).toBeUndefined();
  });

  it('check password handler when password invalid', async () => {
    const handlerParams = {
      patchPasswordDto: {
        password: '123',
        newPassword: '124',
      },
      user: {
        password: '12344',
      } as UserEntity,
    };
    try {
      await patchPasswordHandler.execute(handlerParams);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('Entered password invalid');
    }
  });
});
