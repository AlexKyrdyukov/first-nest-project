import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength,
} from 'class-validator';

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
}
