import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import CryptoService from '../../../crypto/service';
import { SignUpUserHandler } from '../../../auth/commands/handlers/signUpUserHandler';
import AddressEntity from '../../../db/entities/Address';
import RoleEntity from '../../../db/entities/Role';
import UserEntity from '../../../db/entities/User';
import { UserRepositoryFake } from '../FakeUserRepository';
import { AddressRepositoryFake } from '../FakeAddressRepository';
import TokenService from '../../../token/service';
import { HttpException } from '@nestjs/common';
import { RoleRepositoryFake } from '../FakeRoleRepository';

describe('check sign up handler', () => {
  let signUpHandler: SignUpUserHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpUserHandler,
        CryptoService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: UserRepositoryFake,
        },
        {
          provide: getRepositoryToken(AddressEntity),
          useClass: AddressRepositoryFake,
        },
        {
          provide: getRepositoryToken(RoleEntity),
          useClass: RoleRepositoryFake,
        },
        {
          provide: TokenService,
          useValue: {
            createTokens: jest.fn().mockReturnValue({
              accessToken: 'test',
              refreshToken: 'test1',
            }),
          },
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    signUpHandler = module.get(SignUpUserHandler);
  });
  const deviceId = '12234';

  const SignUpUserCommand = {
    signUpDto: {
      email: 'user@mail.com',
      password: '123',
      roles: ['admin'],
      address: {
        city: 'Moscow',
        country: 'Russia',
        street: 'Petrovskaya',
      },
    },
    deviceId,
  };

  it('check class sign up command if user exist', async () => {
    const res = await signUpHandler.execute(SignUpUserCommand);
    expect(res).toStrictEqual({
      user: {
        email: 'user@mail.ru',
        userId: 1,
      },
      address: {
        addresId: 1,
        city: 'Moscow',
        country: 'Russia',
        street: 'Petrovskaya',
      },
      accessToken: 'test',
      refreshToken: 'test1',
    });
  });

  it('check class sign up command if user dont exist', async () => {
    try {
      await signUpHandler.execute(SignUpUserCommand);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('User with this email dont exist'),
        expect(error).toThrow();
    }
  });
});
