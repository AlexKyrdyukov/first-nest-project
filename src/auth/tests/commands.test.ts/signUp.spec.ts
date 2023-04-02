import RedisService from '../../../redis/service';
import { EventBus, EventPublisher, CommandBus } from '@nestjs/cqrs';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import CryptoService from '../../../crypto/service';
import { SignUpUserHandler } from '../../../auth/commands/handlers/signUpUserHandler';
import AddressEntity from '../../../db/entities/Address';
import RoleEntity from '../../../db/entities/Role';
import UserEntity from '../../../db/entities/User';
import { UserRepositoryFake } from '../../../../tests/fakeAppRepo/FakeUserRepository';
import { AddressRepositoryFake } from '../../../../tests/fakeAppRepo/FakeAddressRepository';
import TokenService from '../../../token/service';
import { HttpException } from '@nestjs/common';
import { RoleRepositoryFake } from '../../../../tests/fakeAppRepo/FakeRoleRepository';
import { FakeRedisService } from '../../../../tests/fakeAppRepo/fakeRedisServis';
import { deviceId } from '../../../../tests/fakeAppData/userData/userData';
import { returnedUser } from '../../../../tests/fakeAppData/userData/signUpData';
import { signUpUserData } from '../../../../tests/fakeAppData/userData/signUpData';
import { DataSource, Repository } from 'typeorm';

describe('test sign up handler', () => {
  let signUpHandler: SignUpUserHandler;
  let tokenService: TokenService;
  let userRepository: UserRepositoryFake;

  beforeEach(async () => {
    jest.resetModules();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpUserHandler,
        CryptoService,
        TokenService,
        EventPublisher,
        EventBus,
        CommandBus,
        // UserRepositoryFake,
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
          provide: RedisService,
          useClass: FakeRedisService,
        },
      ],
    }).compile();

    signUpHandler = module.get(SignUpUserHandler);
    tokenService = module.get(TokenService);
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  it('check class sign up command if user already exist', async () => {
    try {
      await signUpHandler.execute(signUpUserData);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('user with this email already exist');
    }
  });

  it('check class sign up command if all succesfully', async () => {
    console.log(userRepository.findOne);
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    const res = await signUpHandler.execute(signUpUserData);
    console.log(res);
    expect(res).toBe({});
  });
  // it('check class sign up command if user dont exist', async () => {
  //   try {
  //     await signUpHandler.execute(SignUpUserCommand);
  //   } catch (error) {
  //     console.log(error);
  //     expect(error).toBeInstanceOf(HttpException);
  //     expect(error.message).toBe('User with this email dont exist'),
  //       expect(error).toThrow();
  //   }
  // });
});
