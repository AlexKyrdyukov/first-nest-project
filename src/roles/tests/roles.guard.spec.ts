import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from '../rolesGuard';
import { ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { Reflector } from '@nestjs/core';

describe('should check roles guard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useClass: Reflector,
        },
      ],
    }).compile();
    rolesGuard = module.get(RolesGuard);
    reflector = module.get(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('should pass test roles guard route does not contain roles', async () => {
    const mockContext = createMock<ExecutionContext>();
    jest.spyOn(reflector, 'get').mockReturnValue([]);
    const res = await rolesGuard.canActivate(mockContext);
    expect(res).toBe(true);
  });

  it('should throw error role user does not match role route', async () => {
    const mockContext = createMock<ExecutionContext>();
    const request = {
      user: {
        roles: [
          {
            name: 'intern',
          },
        ],
      },
    };
    mockContext.switchToHttp().getRequest.mockReturnValue(request);
    jest
      .spyOn(reflector, 'get')
      .mockReturnValue(['develop', 'admin', 'tester']);
    const res = await rolesGuard.canActivate(mockContext);
    expect(res).toBe(false);
  });

  it('should throw error Forbidden', async () => {
    const mockContext = createMock<ExecutionContext>();
    const request = {
      user: {
        roles: [
          {
            name: 'intern',
          },
        ],
      },
    };
    mockContext.switchToHttp().getRequest.mockReturnValue(request);
    jest.spyOn(reflector, 'get').mockImplementation(() => {
      throw new Error();
    });

    try {
      await rolesGuard.canActivate(mockContext);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBeDefined();
    }
  });
});
