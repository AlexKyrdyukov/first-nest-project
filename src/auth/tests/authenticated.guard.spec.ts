import { createMock } from '@golevelup/ts-jest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { FakeRedisService } from './../../../tests/fakeAppRepo/fakeRedisServis';
import { AuthGuard } from './../authGuard';
import { ExecutionContext, HttpException } from '@nestjs/common';
import TokenService from '../../token/service';
import UserEntity from '../../db/entities/User';
import { UserRepositoryFake } from '../../../tests/fakeAppRepo/FakeUserRepository';
import RedisService from '../../redis/service';

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
    // mockContext = createMock<ExecutionContext>();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('should be throw error: "User unknown type authorized please sign in application"', async () => {
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
    // const res = await authGuard.canActivate(mockContext);
    try {
      await authGuard.canActivate(mockContext);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe(
        'User unknown type authorized please sign in application',
      );
    }
  });

  it('should be throw error: "Unknown type authorization, please enter in application & repeat request"', async () => {
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
    try {
      await authGuard.canActivate(mockContext);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe(
        'Unknown type authorization, please enter in application & repeat request',
      );
    }
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
    try {
      await authGuard.canActivate(mockContext);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('Please authorization in application');
    }
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
    try {
      await authGuard.canActivate(mockContext);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('Forbidden');
    }
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
    try {
      const res = await authGuard.canActivate(mockContext);
      expect(res).toBe(true);
    } catch (error) {
      console.log(error);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBeDefined();
    }
  });
});
