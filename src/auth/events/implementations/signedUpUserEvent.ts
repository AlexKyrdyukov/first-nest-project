import { DeviceIdDto } from '../../dto/deviceIdDto';
import { SignUpUserDto } from '../../dto/signUpUserDto';

export class SignedUpUserEvent {
  constructor(
    public readonly signUpDto: SignUpUserDto,
    public readonly deviceId: DeviceIdDto,
  ) {}
}
