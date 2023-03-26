import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { HeroRepository } from '../../../heroes/repository/heroRepository';
import { KillDragonCommand } from '../impl/killDragonCommand';

@CommandHandler(KillDragonCommand)
export class KillDragonHandler implements ICommandHandler<KillDragonCommand> {
  constructor(
    private readonly repository: HeroRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: KillDragonCommand): Promise<any> {
    console.log(command, 'hnaler kill dragon');

    const { heroId, dragonId } = command;
    const hero = this.publisher.mergeObjectContext(
      await this.repository.findOneById(+heroId),
    );
    hero.killEnemy(dragonId);
    hero.commit();
  }
}
