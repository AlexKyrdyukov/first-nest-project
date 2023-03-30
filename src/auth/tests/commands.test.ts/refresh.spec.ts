import { HttpException } from '@nestjs/common';
import { RefreshUserHandler } from './../../commands/handlers/refreshUserHandler';
import { Test, TestingModule } from '@nestjs/testing';
import TokenService from '../../../token/service';

describe('check refresh command handler', () => {
  let refreshHandler: RefreshUserHandler;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshUserHandler,
        {
          provide: TokenService,
          useValue: {
            verifyRefresh: () => 1,
            createTokens: () => {
              return {
                accessToken: 'test',
                refreshToken: 'test1',
              };
            },
          },
        },
      ],
    }).compile();
    refreshHandler = module.get(RefreshUserHandler);
  });

  const refreshParams = {
    refreshUserDto: {
      refreshToken: 'Bearer 1234455',
    },
    deviceId: '1234',
  };

  it('check refresh handler', async () => {
    const res = await refreshHandler.execute(refreshParams);
    expect(res).toStrictEqual({
      accessToken: 'test',
      refreshToken: 'test1',
    });
  });

  it('check refresh handler if unknown type auth', async () => {
    const refreshParams = {
      refreshUserDto: {
        refreshToken: '1234455',
      },
      deviceId: '1234',
    };
    try {
      await refreshHandler.execute(refreshParams);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe(
        'Unknown type authorization, please enter in application & repeat request',
      );
    }
  });
});
