import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import TokenService from '../../../token/service';
import { RefreshUserCommand } from '../implementations/refreshUserCommand';

@CommandHandler(RefreshUserCommand)
export class RefreshUserHandler implements ICommandHandler<RefreshUserCommand> {
  constructor(private readonly tokenService: TokenService) {}
  async execute(command: RefreshUserCommand): Promise<any> {
    const { refreshUserDto, deviceId } = command;
    const [auth, token] = refreshUserDto.refreshToken?.split(' ');

    if (!deviceId || !deviceId.length || auth !== 'Bearer') {
      throw new HttpException(
        'Unknown type authorization, please enter in application & repeat request',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const { userId } = await this.tokenService.verifyRefresh(deviceId, token);

    const { accessToken, refreshToken } = await this.tokenService.createTokens(
      userId,
      deviceId,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
