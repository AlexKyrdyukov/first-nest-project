import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength,
  ValidateNested,
  IsInstance,
  IsDefined,
} from 'class-validator';
import UserEntity from '../../db/entities/User';

import { UserAddressDto } from './userAddressDto';

export class PatchDataDto {
  @ApiProperty({ example: 'user@email.ru', description: 'email post address' })
  @IsEmail({}, { message: 'must be only  valid email' })
  @IsNotEmpty({ message: 'must be only  valid email' })
  @IsString({ message: 'must be only string' })
  @MaxLength(30)
  @MinLength(3)
  readonly email?: string;

  @ApiProperty({ example: '123qwerty', description: 'user password' })
  @IsString({ message: 'must be only string' })
  @IsNotEmpty({ message: 'must be only  valid email' })
  @MaxLength(30)
  @MinLength(2)
  readonly fullName?: string;

  @ApiProperty({ description: 'user address', type: UserAddressDto })
  @ValidateNested({ each: true })
  @IsInstance(UserAddressDto)
  @IsDefined() // why dont work
  @Type(() => UserAddressDto)
  address: UserAddressDto;
}

export class PatchDataresponse {
  @ApiProperty({
    example: UserEntity,
    description: 'user with address & roles',
  })
  user: UserEntity;
}
