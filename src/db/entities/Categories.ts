import { ApiProperty } from '@nestjs/swagger';
import * as typeorm from 'typeorm';
import PostEntity from './Post';

@typeorm.Entity()
class Category {
  @typeorm.PrimaryGeneratedColumn()
  categoryId: number;

  @ApiProperty({
    example: '2023-03-17T19:04:21.913Z',
    description: 'date create category',
  })
  @typeorm.CreateDateColumn()
  createdDate: Date;

  @ApiProperty({
    example: '2023-03-17T19:04:21.913Z',
    description: 'date update category',
  })
  @typeorm.UpdateDateColumn({ select: false })
  updatedDate: Date;

  @ApiProperty({
    example: '2023-03-17T19:04:21.913Z | null',
    description: 'date delete category',
  })
  @typeorm.DeleteDateColumn({ select: false })
  deletedDate: Date;

  @ApiProperty({
    example: 'forest',
    description: 'name category relation with post',
  })
  @typeorm.Column()
  name: string;

  @ApiProperty({
    description: 'categories related to the post | null',
    type: () => [PostEntity],
  })
  @typeorm.ManyToMany(() => PostEntity, (post: PostEntity) => post.categories)
  posts: PostEntity[];
}

export default Category;
