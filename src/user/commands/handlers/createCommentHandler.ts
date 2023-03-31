import { CreateCommentCommand } from '../implementations/createCommentCommand';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import PostEntity from '../../../db/entities/Post';
import CommentEntity from '../../../db/entities/Comment';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}
  async execute(command: CreateCommentCommand): Promise<any> {
    const { createCommentDto, userDto } = command;
    const { postId, content } = createCommentDto;

    const post = await this.postRepository.findOne({
      where: {
        postId,
      },
      relations: {
        comments: true,
      },
    });
    if (!post) {
      return;
    }

    const newComment = this.commentRepository.create({
      content,
      author: userDto,
      post,
    });
    await this.commentRepository.save(newComment);

    const updatedPost = await this.postRepository.save({
      ...post,
      comments: [...post.comments, newComment],
    });
    const { author, ...savedPost } = updatedPost;
    return savedPost;
  }
}
