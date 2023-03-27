import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class PatchPasswordDto {
  @ApiProperty({ example: '123qwerty', description: 'user password' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(11, {
    message:
      'must be no shorter than 3 characters and no longer than 11 characters',
  })
  @MinLength(3, {
    message:
      'must be no shorter than 3 characters and no longer than 11 characters',
  })
  readonly password: string;

  @ApiProperty({ example: '123qwerty', description: 'user new password' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(11, {
    message:
      'must be no shorter than 3 characters and no longer than 11 characters',
  })
  @MinLength(3, {
    message:
      'must be no shorter than 3 characters and no longer than 11 characters',
  })
  readonly newPassword: string;
}
