import { createMock } from '@golevelup/ts-jest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { FakeRedisService } from './../../../tests/fakeAppRepo/fakeRedisServis';
import { AuthGuard } from './../authGuard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import TokenService from '../../token/service';
import UserEntity from '../../db/entities/User';
import { UserRepositoryFake } from '../../../tests/fakeAppRepo/FakeUserRepository';
import RedisService from '../../redis/service';

describe('check auth guard', () => {
  let authGuard: AuthGuard;
  let context: ExecutionContext;
  let mockContext: ExecutionContext;

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
    // mockContext = createMock<ExecutionContext>();
  });

  it('create test auth guard', async () => {
    const mockContext = createMock<ExecutionContext>();
    console.log(20, context);
    const request = {
      headers: {
        authorization: 'Bearer token',
      },
      params: {
        userId: 1,
      },
    };
    const res = mockContext.switchToHttp().getRequest.mockReturnValue(request);
    // const res = await authGuard.canActivate(mockContext);
    console.log(mockContext, res);
    const canActivate = authGuard.canActivate(mockContext);
    expect(canActivate).toBe(true);
  });
});
