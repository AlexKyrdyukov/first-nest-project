import { ApiProperty } from '@nestjs/swagger';
import * as typeorm from 'typeorm';

import UserEntity from './User';
import CommentEntity from './Comment';
import CategoryEntity from './Categories';

@typeorm.Entity()
class Role {
  @ApiProperty({ example: 1, description: 'unique identificator' })
  @typeorm.PrimaryGeneratedColumn()
  roleId: number;

  @ApiProperty({
    example: '2023-03-17T19:04:21.913Z',
    description: 'date create role',
  })
  @typeorm.CreateDateColumn()
  createdDate: Date;

  @ApiProperty({
    example: '2023-03-17T19:04:21.913Z',
    description: 'date update role',
  })
  @typeorm.UpdateDateColumn({ select: false })
  updatedDate: Date;

  @ApiProperty({
    example: '2023-03-17T19:04:21.913Z | null',
    description: 'date delete role',
  })
  @typeorm.DeleteDateColumn({ select: false })
  deletedDate: Date;

  @ApiProperty({
    example: 'cars',
    description: 'post category',
  })
  @typeorm.Column({ nullable: true })
  name?: string;

  @ApiProperty({
    description: 'users relation with roles',
    type: () => [UserEntity],
  })
  @typeorm.ManyToMany(() => UserEntity, (user: UserEntity) => user.roles)
  users: UserEntity[];
}

export default Role;
