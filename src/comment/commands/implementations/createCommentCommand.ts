import { CreateCommentDto } from '../../dto/createCommentDto';
import UserEntity from '../../../db/entities/User';

export class CreateCommentCommand {
  constructor(
    public readonly createCommentDto: CreateCommentDto,
    public readonly userDto: Partial<UserEntity>, // change type
  ) {}
}
