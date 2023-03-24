import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { HeroFoundItemEvent } from '../impl/heroFoundItemEvent';

@EventsHandler(HeroFoundItemEvent)
export class HeroFoundItemHandler implements IEventHandler<HeroFoundItemEvent> {
  handle(event: HeroFoundItemEvent) {
    console.log(event, 'ASYNC HeroFounfItemEvent');
  }
}
