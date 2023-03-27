import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs';
import { SignedUpUserEvent } from '../implementations/signedUpUserEvent';

@EventsHandler(SignedUpUserEvent)
export class SignedUpUserHandler implements IEventHandler<SignedUpUserEvent> {
  handle(event: SignedUpUserEvent) {
    console.log('signedUp event .........: ', event);
  }
}
