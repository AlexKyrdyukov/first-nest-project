import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { HeroRepository } from '../../../heroes/repository/heroRepository';
import { DropAncientItemCommand } from '../impl/dropAncientItemCommands';

@CommandHandler(DropAncientItemCommand)
export class DropAncientItemHandler
  implements ICommandHandler<DropAncientItemCommand>
{
  constructor(
    public readonly repository: HeroRepository,
    public readonly publisher: EventPublisher,
  ) {}

  async execute(command: DropAncientItemCommand): Promise<any> {
    console.log(command, 'work command drop ancient');

    const { heroId, itemId } = command;
    const hero = this.publisher.mergeObjectContext(
      await this.repository.findOneById(+heroId),
    );
    console.log(hero, 'dropAncient');
    hero.addItem(itemId);
    hero.commit();
  }
}
