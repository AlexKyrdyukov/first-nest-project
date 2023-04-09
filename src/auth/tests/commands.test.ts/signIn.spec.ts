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

describe('check auth sign in commands', () => {
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

  it('should throw error invalid password', async () => {
    await signInHandler.execute(signInUserData).catch((err) => {
      expect(err).toBeInstanceOf(HttpException);
      expect(err).toHaveProperty('status', 400);
      expect(err.message).toBe('Entered password invalid');
    });
  });

  it('should return user with accessToken, refreshToken', async () => {
    jest
      .spyOn(cryptoService, 'checkValid')
      .mockResolvedValue(null as unknown as void);
    const res = await signInHandler.execute(signInUserData);
    expect(res).toHaveProperty('accessToken');
    expect(res).toHaveProperty('refreshToken');
    expect(res).toHaveProperty('user');
  });

  it('should throw error dont existen user', async () => {
    jest.spyOn(userRepository, 'createQueryBuilder').mockImplementation(() => ({
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockReturnValue(null),
    }));

    jest
      .spyOn(cryptoService, 'checkValid')
      .mockResolvedValue(null as unknown as void);

    await signInHandler.execute(signInUserData).catch((err) => {
      expect(err).toBeInstanceOf(HttpException);
      expect(err).toHaveProperty('status', 400);
      expect(err.message).toBe('User with this email dont exist');
    });
  });
});
