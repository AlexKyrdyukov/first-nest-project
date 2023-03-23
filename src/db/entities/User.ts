import { ApiProperty } from '@nestjs/swagger';
import * as typeorm from 'typeorm';
import CommentEntity from './Comment';
import PostEntity from './Post';
import AddresEntity from './Address';

@typeorm.Entity()
class User {
  @ApiProperty({ example: 1, description: 'unique identificator' })
  @typeorm.PrimaryGeneratedColumn()
  userId: number;

  @ApiProperty({
    example: '2023-03-17T19:04:21.913Z',
    description: 'date create user',
  })
  @typeorm.CreateDateColumn({ select: false })
  createdDate: Date;

  @ApiProperty({
    example: '2023-03-17T19:04:21.913Z',
    description: 'date update user',
  })
  @typeorm.UpdateDateColumn({ select: false })
  updatedDate: Date;

  @ApiProperty({
    example: '2023-03-17T19:04:21.913Z | null',
    description: 'date delete user',
  })
  @typeorm.DeleteDateColumn({ select: false })
  deletedDate: Date;

  // eslint-disable-next-line prettier/prettier
  @typeorm.Column({ unique: false, nullable: false, type: 'varchar', select: false })
  password: string;

  // eslint-disable-next-line prettier/prettier
  @typeorm.Column({ unique: false, nullable: false, type: 'varchar', select: false })
  salt: string;

  @ApiProperty({
    example: 'Alex Alexov',
    description: 'full name user | null',
  })
  @typeorm.Column({ unique: false, nullable: true, type: 'varchar' })
  fullName: string;

  @ApiProperty({
    example: 'user@email.ru',
    description: 'user post address',
  })
  @typeorm.Column({ unique: true, nullable: false, type: 'varchar' })
  email: string;

  @ApiProperty({
    example: 'user@email.ru',
    description: 'links on user photo | null',
  })
  @typeorm.Column({ unique: false, nullable: true, type: 'varchar' })
  avatar?: string;

  @typeorm.OneToMany(
    () => CommentEntity,
    (comment: CommentEntity) => comment.author,
  )
  comment: CommentEntity[];

  @typeorm.OneToMany(() => PostEntity, (post: PostEntity) => post.author)
  posts: PostEntity[];

  @typeorm.OneToOne(
    () => AddresEntity,
    (address: AddresEntity) => address.user,
    {
      eager: true,
      cascade: true,
    },
  )
  @typeorm.JoinColumn()
  address: AddresEntity;
}

export default User;
