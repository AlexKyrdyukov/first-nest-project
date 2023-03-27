import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength,
} from 'class-validator';
import UserEntity from '../../db/entities/User';

export class SignInUserDto {
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
}

export class ReturnSignInDto {
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
