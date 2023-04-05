import { CreatePostDto } from '../../dto/createPostDto';
import UserEntity from '../../../db/entities/User';

export class CreatePostCommand {
  constructor(
    public readonly postDto: CreatePostDto,
    public readonly userDto: Partial<UserEntity>,
  ) {}
}
