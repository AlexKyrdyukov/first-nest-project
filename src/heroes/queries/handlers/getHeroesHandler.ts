import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { HeroRepository } from '../../../heroes/repository/heroRepository';
import { GetHeroesQuery } from '../impl';

@QueryHandler(GetHeroesQuery)
export class GetHeroesHandler implements IQueryHandler<GetHeroesQuery> {
  constructor(private readonly repository: HeroRepository) {}

  async execute(query: GetHeroesQuery): Promise<any> {
    console.log(query, 'query async func');
    return this.repository.findAll();
  }
}
