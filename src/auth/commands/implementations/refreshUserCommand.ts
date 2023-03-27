import { RefreshTokenDto } from '../../dto/refreshDto';

export class RefreshUserCommand {
  constructor(
    private readonly refresUserDto: RefreshTokenDto,
    private readonly deviceId: string,
  ) {}
}
