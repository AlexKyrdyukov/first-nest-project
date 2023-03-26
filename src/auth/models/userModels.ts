import { SignInUserDto } from './../dto/signInUserDto';
import { AggregateRoot } from '@nestjs/cqrs';
import { DeviceIdDto } from '../dto/deviceIdDto';
import { SignUpUserDto } from '../dto/signUpUserDto';
import { SignedUpUserEvent } from '../events/implementations/signedUpUserEvent';

export class User extends AggregateRoot {
  constructor(private readonly userId: string) {
    super();
  }

  // signUp(signUpDto: SignUpUserDto, deviceId: DeviceIdDto) {
  //   this.apply(new SignedUpUserEvent(signUpDto, deviceId));
  // }

  // signIn(signInDto: SignInUserDto, ) {
  //   this.apply(new )
  // }

  // refresh() {

  // }
}
