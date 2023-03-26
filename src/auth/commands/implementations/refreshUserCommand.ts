import { DeviceIdDto } from '../../dto/deviceIdDto';
import { RefreshTokenDto } from '../../dto/refreshDto';

export class RefreshUserCommand {
  constructor(
    private readonly refreshToken: RefreshTokenDto,
    private readonly deviceId: DeviceIdDto,
  ) {}
}
