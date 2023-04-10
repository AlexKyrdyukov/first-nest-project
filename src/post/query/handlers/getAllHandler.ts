import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { GetAllPostQuery } from '../implementations/getAllPostQuery';

import PostEntity from '../../../db/entities/Post';

@QueryHandler(GetAllPostQuery)
export class GetAllPostHandler implements IQueryHandler<GetAllPostQuery> {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}
  async execute(query: GetAllPostQuery): Promise<any> {
    const {
      getAllPostDto: { userId },
    } = query;
    const [posts, count] = await this.postRepository.findAndCount({
      where: {
        author: {
          userId,
        },
      },
    });
    if (!posts.length) {
      throw new HttpException('That user havent posts', HttpStatus.BAD_REQUEST);
    }
    return {
      posts,
      count,
    };
  }
}
