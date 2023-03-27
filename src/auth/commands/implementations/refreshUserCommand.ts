import { RefreshTokenDto } from '../../dto/refreshDto';

export class RefreshUserCommand {
  constructor(
    public readonly refreshUserDto: RefreshTokenDto,
    public readonly deviceId: string,
  ) {}
}
