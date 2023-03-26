import { Injectable } from '@nestjs/common';
import { Hero } from '../models/heroModels';
import { userHero } from './fixtures/user';

@Injectable()
export class HeroRepository {
  async findOneById(id: number): Promise<Hero> {
    console.log('work repos findoneById, id: ', id);
    return userHero;
  }

  async findAll(): Promise<Hero[]> {
    console.log('findAll work from heroRepo');
    return [userHero];
  }
}
