import { GetAllCommentDto } from '../../../comment/dto/getAllCommentDto';

export class GetAllCommentQuery {
  constructor(public readonly getAllCommentDto: GetAllCommentDto) {}
}
