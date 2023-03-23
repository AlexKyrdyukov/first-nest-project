import { ApiProperty } from '@nestjs/swagger';
import * as typeorm from 'typeorm';

import UserEntity from './User';
import PostEntity from './Post';

@typeorm.Entity()
class Comment {
  @ApiProperty({ example: 1, description: 'unique identificator' })
  @typeorm.PrimaryGeneratedColumn()
  commentId: number;

  @ApiProperty({
    example: '2023-03-17T19:04:21.913Z',
    description: 'date create comment',
  })
  @typeorm.CreateDateColumn()
  createdDate: Date;

  @ApiProperty({
    example: '2023-03-17T19:04:21.913Z',
    description: 'date update comment',
  })
  @typeorm.UpdateDateColumn({ select: false })
  updatedDate: Date;

  @ApiProperty({
    example: '2023-03-17T19:04:21.913Z | null',
    description: 'date delete comment',
  })
  @typeorm.DeleteDateColumn({ select: false })
  deletedDate: Date;

  @ApiProperty({
    example: 'this is cool post',
    description: 'text comment',
  })
  @typeorm.Column({ unique: false, nullable: false, type: 'varchar' })
  content: string;

  @typeorm.ManyToOne(() => UserEntity, (author: UserEntity) => author.posts)
  author: UserEntity;

  @typeorm.ManyToOne(() => PostEntity, (post: PostEntity) => post.comments)
  post: PostEntity;
}

export default Comment;
