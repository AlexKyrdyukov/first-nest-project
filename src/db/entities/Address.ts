import { ApiProperty } from '@nestjs/swagger';
import * as typeorm from 'typeorm';
import UserEntity from './User';

@typeorm.Entity()
class Address {
  @ApiProperty({ example: 1, description: 'unique identificator' })
  @typeorm.PrimaryGeneratedColumn()
  addresId: number;

  @ApiProperty({
    example: '2023-03-17T19:04:21.913Z',
    description: 'date create address',
  })
  @typeorm.CreateDateColumn()
  createdDate: Date;

  @ApiProperty({
    example: '2023-03-17T19:04:21.913Z',
    description: 'date update address',
  })
  @typeorm.UpdateDateColumn({ select: false })
  updatedDate: Date;

  @ApiProperty({
    example: '2023-03-17T19:04:21.913Z | null',
    description: 'date delete address',
  })
  @typeorm.DeleteDateColumn({ select: false })
  deletedDate: Date;

  @ApiProperty({
    example: 'Moscovskaya',
    description: 'stret of location',
  })
  @typeorm.Column()
  street: string;

  @ApiProperty({ example: 'New York', description: 'city of location' })
  @typeorm.Column()
  city: string;

  @ApiProperty({
    example: 'United States oj America',
    description: 'country of location',
  })
  @typeorm.Column()
  country: string;

  @ApiProperty({
    description: 'user reltions with address',
    type: () => UserEntity,
  })
  @typeorm.OneToOne(() => UserEntity, (user: UserEntity) => user.address)
  user: UserEntity;
}

export default Address;
