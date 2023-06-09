import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsEmail,
  MaxLength,
  MinLength,
  IsIn,
  Matches,
  IsInstance,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserAddressDto } from './userAddressDto';
import UserEntity from '../../db/entities/User';

const validRoles = ['admin', 'user', 'intern', 'develop', 'tester'];

export class SignUpUserDto {
  @ApiProperty({ example: 'user@email.ru', description: 'email post address' })
  @IsEmail({}, { message: 'must be only  valid email' })
  @IsNotEmpty({ message: 'must be only  valid email' })
  @IsString({ message: 'must be only string' })
  @MaxLength(30)
  @MinLength(3)
  email: string;

  @ApiProperty({ example: '123qwerty', description: 'user password' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30, {
    message:
      'must be no shorter than 3 characters and no longer than 11 characters',
  })
  @MinLength(3, {
    message:
      'must be no shorter than 3 characters and no longer than 11 characters',
  })
  password: string;

  @ApiProperty({ example: '["admin"]', description: 'user roles' })
  @IsNotEmpty()
  @IsIn(validRoles, { each: true })
  @Matches('^[a-zA-Z\\s]+$', undefined, { each: true })
  roles: string[];

  @ApiProperty({ description: 'user address', type: UserAddressDto })
  @ValidateNested({ each: true })
  @IsInstance(UserAddressDto)
  @Type(() => UserAddressDto)
  address: UserAddressDto;
}

export class SignUpResponse {
  @ApiProperty({
    example: UserEntity,
    description: 'user',
  })
  user: UserEntity;
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.',
    description: 'user access token',
  })
  accessToken: string;
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.',
    description: 'user refresh token',
  })
  refreshToken: string;
}
