import { SignInUserDto } from '../../dto/signInUserDto';

export class SignInUserCommand {
  constructor(
    public readonly signInDto: SignInUserDto,
    public readonly deviceId: string,
  ) {}
}
