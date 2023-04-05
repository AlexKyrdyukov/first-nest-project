import { SignInUserDto } from './../dto/signInUserDto';
import { AggregateRoot } from '@nestjs/cqrs';
import { SignUpUserDto } from '../dto/signUpUserDto';

export class User extends AggregateRoot {
  constructor(private readonly userId: number) {
    super();
  }

  signUp(signUpDto: SignUpUserDto, deviceId: string) {
    // this.apply(new SignedUpUserEvent(signUpDto, deviceId));
  }

  signIn(signInDto: SignInUserDto, deviceId: string) {
    // this.apply(new SignedInUserEvent(signInDto, deviceId));
  }

  // refresh() {

  // }
}
