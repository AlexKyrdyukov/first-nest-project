import { DeviceIdDto } from 'src/auth/dto/deviceIdDto';
import { SignInUserDto } from '../../dto/signInUserDto';

export class SignInUserCommand {
  constructor(
    private readonly signUpDto: SignInUserDto,
    private readonly deviceId: DeviceIdDto,
  ) {}
}
