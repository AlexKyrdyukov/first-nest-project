import { CreateCommentDto } from '../../../user/dto/createCommentDto';
import UserEntity from '../../../db/entities/User';

export class CreateCommentCommand {
  constructor(
    public readonly createCommentDto: CreateCommentDto,
    public readonly userDto: UserEntity,
  ) {}
}
