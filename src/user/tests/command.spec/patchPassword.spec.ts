import { HttpException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import UserEntity from '../../../db/entities/User';
import CryptoService from '../../../crypto/service';

import { UserRepositoryFake } from '../../../../tests/fakeAppRepo/FakeUserRepository';
import { PatchPasswordHandler } from './../../commands/handlers/patchPasswordHandler';

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('should pass check password & update data', async () => {
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
    const result = await patchPasswordHandler.execute(handlerParams);
    expect(result).not.toBeTruthy();
    expect(result).toBeUndefined();
  });

  it('should throw error invalid password', async () => {
    const handlerParams = {
      patchPasswordDto: {
        password: '123',
        newPassword: '124',
      },
      user: {
        password: '12344',
      } as UserEntity,
    };
    await patchPasswordHandler.execute(handlerParams).catch((err) => {
      expect(err).toBeInstanceOf(HttpException);
      expect(err.status).toBe(400);
      expect(err.message).toBe('Entered password invalid');
    });
  });
});
