import { SignUpUserDto } from '../../dto/signUpUserDto';

export class SignUpUserCommand {
  constructor(
    public readonly signUpDto: SignUpUserDto,
    public readonly deviceId: string,
  ) {}
}
