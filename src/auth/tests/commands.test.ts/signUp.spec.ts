import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventBus, EventPublisher, CommandBus } from '@nestjs/cqrs';

import { SignUpUserHandler } from '../../../auth/commands/handlers/signUpUserHandler';
import { UserRepositoryFake } from '../../../../tests/fakeAppRepo/FakeUserRepository';

import AddressEntity from '../../../db/entities/Address';
import RoleEntity from '../../../db/entities/Role';
import UserEntity from '../../../db/entities/User';

import CryptoService from '../../../crypto/service';
import TokenService from '../../../token/service';
import RedisService from '../../../redis/service';

import { FakeRedisService } from '../../../../tests/fakeAppRepo/fakeRedisServis';
import { signUpUserData } from '../../../../tests/fakeAppData/userData/signUpData';
import { RoleRepositoryFake } from '../../../../tests/fakeAppRepo/FakeRoleRepository';
import { AddressRepositoryFake } from '../../../../tests/fakeAppRepo/FakeAddressRepository';

describe('test sign up handler', () => {
  let signUpHandler: SignUpUserHandler;
  let userRepository: UserRepositoryFake;
  let roleRepository: RoleRepositoryFake;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpUserHandler,
        CryptoService,
        TokenService,
        EventPublisher,
        EventBus,
        CommandBus,
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
    userRepository = module.get(getRepositoryToken(UserEntity));
    roleRepository = module.get(getRepositoryToken(RoleEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
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
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    const res = await signUpHandler.execute(signUpUserData);
    expect(res).toHaveProperty('accessToken');
    expect(res).toHaveProperty('refreshToken');
    expect(res).toHaveProperty('user');
    expect(res.accessToken).toHaveLength(143);
    expect(res.refreshToken).toHaveLength(143);
  });

  it('check sign up command if create roles', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    jest
      .spyOn(roleRepository, 'findOne')
      .mockImplementation(() => Promise.resolve(null));
    const res = await signUpHandler.execute(signUpUserData);
    expect(res).toHaveProperty('accessToken');
    expect(res).toHaveProperty('refreshToken');
    expect(res).toHaveProperty('user');
    expect(res.accessToken).toHaveLength(143);
    expect(res.refreshToken).toHaveLength(143);
  });
});
