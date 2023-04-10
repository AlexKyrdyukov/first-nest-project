import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import PostEntity from '../../../db/entities/Post';
import { GetAllCommentQuery } from '../implementations/getAllQuery';

@QueryHandler(GetAllCommentQuery)
export class GetAllCommentHandler implements IQueryHandler<GetAllCommentQuery> {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}
  async execute(query: GetAllCommentQuery): Promise<any> {
    const {
      getAllCommentDto: { postId },
    } = query;
    const post = await this.postRepository.findOne({
      where: {
        postId,
      },
      relations: {
        categories: true,
        comments: {
          author: true,
        },
      },
    });
    if (!post) {
      throw new HttpException('This post not found', HttpStatus.BAD_REQUEST);
    }
    return post;
  }
}
