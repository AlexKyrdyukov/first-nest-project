import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { DropAncientItemCommand } from '../commands/impl/dropAncientItemCommands';
import { HeroKilledDragonEvent } from '../events/impl/heroKilledDragon';

const itemId = '0';

@Injectable()
export class HeroesGameSagas {
  @Saga()
  dragonKilled = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(HeroKilledDragonEvent),
      delay(1000),
      map((event) => {
        console.log(
          'saga is worked events',
          // events$,
          'event:',
          event,
          'end sagas worked',
        );
        return new DropAncientItemCommand(event.heroid, itemId);
      }),
    );
  };
}
