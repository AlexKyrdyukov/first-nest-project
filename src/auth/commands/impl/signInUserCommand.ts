import { DeviceIdDto } from 'src/auth/dto/deviceIdDto';
import { SignInUserDto } from '../../../auth/dto/signInUserDto';

export class signUpUserCommand {
  constructor(
    private readonly signUpDto: SignInUserDto,
    private readonly deviceId: DeviceIdDto,
  ) {}
}
