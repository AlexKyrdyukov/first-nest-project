import { DeviceIdDto } from 'src/auth/dto/deviceIdDto';
import { SignUpUserDto } from '../../../auth/dto/signUpUserDto';

export class signUpUserCommand {
  constructor(
    private readonly signUpDto: SignUpUserDto,
    private readonly deviceId: DeviceIdDto,
  ) {}
}
