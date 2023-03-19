import Joi from 'joi';
import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export const updtaUserSchema = Joi.object({
  email: Joi.string().trim().email(),
  fullName: Joi.string().trim().min(3).max(20),
});

class UpdateUserDto {
  @ApiProperty({ example: 'user@email.ru', description: 'email post address' })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: '123qwerty', description: 'user password' })
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(10)
  readonly password: string;
}

export default UpdateUserDto;
