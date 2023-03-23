import { ApiProperty } from '@nestjs/swagger';
import * as typeorm from 'typeorm';

import UserEntity from './User';
import CommentEntity from './Comment';

@typeorm.Entity()
class Post {
  @ApiProperty({ example: 1, description: 'unique identificator' })
  @typeorm.PrimaryGeneratedColumn()
  postId: number;

  @ApiProperty({
    example: '2023-03-17T19:04:21.913Z',
    description: 'date create post',
  })
  @typeorm.CreateDateColumn()
  createdDate: Date;

  @ApiProperty({
    example: '2023-03-17T19:04:21.913Z',
    description: 'date update post',
  })
  @typeorm.UpdateDateColumn({ select: false })
  updatedDate: Date;

  @ApiProperty({
    example: '2023-03-17T19:04:21.913Z | null',
    description: 'date delete post',
  })
  @typeorm.DeleteDateColumn({ select: false })
  deletedDate: Date;

  @ApiProperty({
    example: 'this is cool post',
    description: 'text post',
  })
  @typeorm.Column({ unique: false, nullable: false, type: 'varchar' })
  content: string;

  @typeorm.ManyToOne(() => UserEntity, (author: UserEntity) => author.posts)
  author: UserEntity;

  @typeorm.OneToMany(
    () => CommentEntity,
    (comment: CommentEntity) => comment.post,
  )
  comments: CommentEntity[];
}

export default Post;
