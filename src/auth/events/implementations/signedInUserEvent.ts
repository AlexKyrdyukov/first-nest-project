import { SignInUserDto } from '../../../auth/dto/signInUserDto';

export class SignedInUserEvent {
  constructor(
    public readonly signInDto: SignInUserDto,
    public readonly deviceId: string,
  ) {}
}
