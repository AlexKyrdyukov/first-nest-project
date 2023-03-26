import { ApiProperty } from '@nestjs/swagger';
import * as typeorm from 'typeorm';

import UserEntity from './User';
import CommentEntity from './Comment';
import CategoryEntity from './Categories';

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
    example: 'content post about cars',
    description: 'text post',
  })
  @typeorm.Column({ unique: false, nullable: false, type: 'varchar' })
  content: string;

  @ApiProperty({
    example: 'this post about cars',
    description: 'title post',
  })
  @typeorm.Column()
  title: string;

  @ApiProperty({
    example: 'cars',
    description: 'post category',
  })
  @typeorm.Column({ nullable: true })
  category?: string;

  @ApiProperty({
    description: 'author post',
    type: () => UserEntity,
  })
  @typeorm.ManyToOne(() => UserEntity, (author: UserEntity) => author.posts)
  author: UserEntity;

  @ApiProperty({
    description: 'comments related to the post | null',
    type: () => [CommentEntity],
  })
  @typeorm.OneToMany(
    () => CommentEntity,
    (comment: CommentEntity) => comment.post,
  )
  comments: CommentEntity[];

  @ApiProperty({
    description: 'categories related to the post | null',
    type: () => [CategoryEntity],
  })
  @typeorm.ManyToMany(
    () => CategoryEntity,
    (category: CategoryEntity) => category.posts,
  )
  categories: CategoryEntity[];
}

export default Post;
