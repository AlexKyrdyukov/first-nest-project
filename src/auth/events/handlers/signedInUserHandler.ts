import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs';
import { SignedInUserEvent } from '../implementations/signedInUserEvent';

@EventsHandler(SignedInUserEvent)
export class SignedUpUserHandler implements IEventHandler<SignedInUserEvent> {
  handle(event: SignedInUserEvent) {
    console.log('signed in event .........: ', event);
  }
}
