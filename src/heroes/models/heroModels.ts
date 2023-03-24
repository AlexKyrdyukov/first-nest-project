import { AggregateRoot } from '@nestjs/cqrs';
import { HeroFoundItemEvent } from '../events/impl/heroFoundItemEvent';
import { HeroKilledDragonEvent } from '../events/impl/heroKilledDragon';

export class Hero extends AggregateRoot {
  constructor(private readonly id: string) {
    super();
  }

  killEnemy(enemyId: string) {
    console.log(enemyId);
    this.apply(new HeroKilledDragonEvent(this.id, enemyId));
  }

  addItem(itemId: string) {
    console.log(itemId);
    this.apply(new HeroFoundItemEvent(this.id, itemId));
  }
}
