import { DeviceIdDto } from '../../../auth/dto/deviceIdDto';
import { RefreshTokenDto } from '../../../auth/dto/refreshDto';

export class refreshUserCommand {
  constructor(
    private readonly refreshToken: RefreshTokenDto,
    private readonly deviceId: DeviceIdDto,
  ) {}
}
