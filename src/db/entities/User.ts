import { ApiProperty } from '@nestjs/swagger';
import * as typeorm from 'typeorm';
import CommentEntity from './Comment';
import PostEntity from './Post';
import AddresEntity from './Address';
import RoleEntity from './Role';

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

  @ApiProperty({
    description: 'comments user | null',
    type: () => CommentEntity,
  })
  @typeorm.OneToMany(
    () => CommentEntity,
    (comment: CommentEntity) => comment.author,
  )
  comment: CommentEntity[];

  @ApiProperty({
    description: 'posts user | null',
    type: () => PostEntity,
  })
  @typeorm.OneToMany(() => PostEntity, (post: PostEntity) => post.author)
  posts: PostEntity[];

  @ApiProperty({
    description: 'address user',
    type: AddresEntity,
  })
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

  @ApiProperty({
    description: 'roles relation with users',
    type: () => RoleEntity,
  })
  @typeorm.ManyToMany(() => RoleEntity, (role: RoleEntity) => role.users)
  @typeorm.JoinTable()
  roles: RoleEntity[];
}

export default User;
