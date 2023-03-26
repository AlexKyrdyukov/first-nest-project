import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { HeroesGameController } from './controller';
import { QueryHandlers } from './queries/handlers';
import { HeroRepository } from './repository/heroRepository';
import { HeroesGameSagas } from './sagas/heroesSagas';

@Module({
  imports: [CqrsModule],
  controllers: [HeroesGameController],
  providers: [
    HeroRepository,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
    HeroesGameSagas,
  ],
})
export class HeroesGameModule {}
