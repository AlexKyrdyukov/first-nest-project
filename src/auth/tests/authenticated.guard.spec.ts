import { createMock } from '@golevelup/ts-jest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExecutionContext, HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import UserEntity from '../../db/entities/User';

import { AuthGuard } from './../authGuard';

import TokenService from '../../token/service';
import RedisService from '../../redis/service';

import { FakeRedisService } from './../../../tests/fakeAppRepo/fakeRedisServis';
import { UserRepositoryFake } from '../../../tests/fakeAppRepo/FakeUserRepository';

describe('check auth guard', () => {
  let authGuard: AuthGuard;
  let tokenService: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        TokenService,
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
    authGuard = module.get(AuthGuard);
    tokenService = module.get(TokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('should throw error: "User unknown type authorized please sign in application"', async () => {
    const mockContext = createMock<ExecutionContext>();

    const request = {
      headers: {
        authorization: 'Bearer token',
      },
      params: {
        userId: 1,
      },
    };
    mockContext.switchToHttp().getRequest.mockReturnValue(request);
    await authGuard.canActivate(mockContext).catch((err) => {
      expect(err).toBeInstanceOf(HttpException);
      expect(err.status).toBe(401);
      expect(err.message).toBe(
        'User unknown type authorized please sign in application',
      );
    });
  });

  it('should throw error: "Unknown type authorization, please enter in application & repeat request"', async () => {
    const mockContext = createMock<ExecutionContext>();

    const request = {
      headers: {
        authorization: 'token',
      },
      params: {
        userId: 1,
      },
    };
    mockContext.switchToHttp().getRequest.mockReturnValue(request);
    await authGuard.canActivate(mockContext).catch((err) => {
      expect(err).toBeInstanceOf(HttpException);
      expect(err.status).toBe(401);
      expect(err.message).toBe(
        'Unknown type authorization, please enter in application & repeat request',
      );
    });
  });

  it('should be throw error: "Please authorization in application"', async () => {
    const mockContext = createMock<ExecutionContext>();
    const request = {
      headers: {},
      params: {
        userId: 1,
      },
    };
    mockContext.switchToHttp().getRequest.mockReturnValue(request);
    await authGuard.canActivate(mockContext).catch((err) => {
      expect(err).toBeInstanceOf(HttpException);
      expect(err.status).toBe(401);
      expect(err.message).toBe('Please authorization in application');
    });
  });

  it('should be throw error: "Forbidden"', async () => {
    jest
      .spyOn(tokenService, 'verifyToken')
      .mockResolvedValue({ userId: 22 as never });
    const mockContext = createMock<ExecutionContext>();
    const request = {
      headers: {
        authorization: 'Bearer token',
      },
      params: {
        userId: 1,
      },
    };
    mockContext.switchToHttp().getRequest.mockReturnValue(request);
    await authGuard.canActivate(mockContext).catch((err) => {
      expect(err).toBeInstanceOf(HttpException);
      expect(err.status).toBe(401);
      expect(err.message).toBe('Forbidden');
    });
  });

  it('should be pass authenticated, find user and add user in request', async () => {
    jest
      .spyOn(tokenService, 'verifyToken')
      .mockResolvedValue({ userId: 1 as never });
    const mockContext = createMock<ExecutionContext>();
    const request = {
      headers: {
        authorization: 'Bearer token',
      },
      params: {
        userId: 1,
      },
    };
    mockContext.switchToHttp().getRequest.mockReturnValue(request);
    const result = await authGuard.canActivate(mockContext);
    expect(result).toBe(true);
    expect(result).toBeDefined();
    expect(result).toBeTruthy();
  });
});
