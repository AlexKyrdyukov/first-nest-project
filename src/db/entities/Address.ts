import { ApiProperty } from '@nestjs/swagger';
import * as typeorm from 'typeorm';
import UserEntity from './User';

@typeorm.Entity()
class Address {
  @ApiProperty({ example: 1, description: 'unique identificator' })
  @typeorm.PrimaryGeneratedColumn()
  addresId: number;

  @ApiProperty({
    example: 'Obema chmo street',
    description: 'stret of location',
  })
  @typeorm.Column()
  street: string;

  @ApiProperty({ example: 'New York', description: 'city of location' })
  @typeorm.Column()
  city: string;

  @ApiProperty({ example: 'America', description: 'country of location' })
  @typeorm.Column()
  country: string;

  @typeorm.OneToOne(() => UserEntity, (user: UserEntity) => user.address)
  user: UserEntity;
}

export default Address;
