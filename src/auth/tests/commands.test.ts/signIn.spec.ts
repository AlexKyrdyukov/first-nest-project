import { HttpException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { EventPublisher, EventBus, CommandBus } from '@nestjs/cqrs';

import TokenService from '../../../token/service';
import CryptoService from '../../../crypto/service';
import RedisService from '../../../redis/service';

import UserEntity from '../../../db/entities/User';
import { SignInUserHandler } from '../../commands/handlers/signInUserHandler';
import { UserRepositoryFake } from '../../../../tests/fakeAppRepo/FakeUserRepository';
import { FakeRedisService } from './../../../../tests/fakeAppRepo/fakeRedisServis';
import { signInUserData } from '../../../../tests/fakeAppData/userData/signInData';

describe('check auth commands', () => {
  let signInHandler: SignInUserHandler;
  let cryptoService: CryptoService;
  let userRepository: UserRepositoryFake;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignInUserHandler,
        TokenService,
        CryptoService,
        EventPublisher,
        EventBus,
        CommandBus,
        {
          provide: RedisService,
          useClass: FakeRedisService,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: UserRepositoryFake,
        },
      ],
    }).compile();

    signInHandler = module.get(SignInUserHandler);
    cryptoService = module.get(CryptoService);
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('check class sign in if password invalid', async () => {
    try {
      await signInHandler.execute(signInUserData);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('Entered password invalid');
    }
  });

  it('check func if password valid', async () => {
    jest
      .spyOn(cryptoService, 'checkValid')
      .mockResolvedValue(null as unknown as void);
    const res = await signInHandler.execute(signInUserData);
    expect(res).toHaveProperty('accessToken');
    expect(res).toHaveProperty('refreshToken');
    expect(res).toHaveProperty('user');
  });

  it('check class sign in if user not found', async () => {
    jest.spyOn(userRepository, 'createQueryBuilder').mockImplementation(() => ({
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockReturnValue(null),
    }));

    jest
      .spyOn(cryptoService, 'checkValid')
      .mockResolvedValue(null as unknown as void);

    try {
      await signInHandler.execute(signInUserData);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('User with this email dont exist');
    }
  });
});
