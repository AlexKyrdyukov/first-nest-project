import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export const updateUserSchema = Joi.object({
  email: Joi.string().trim().email(),
  fullName: Joi.string().trim().min(3).max(20),
});

class UpdateUserDto {
  @ApiProperty({ example: 'user@email.ru', description: 'email post address' })
  readonly email?: string;

  @ApiProperty({ example: '123qwerty', description: 'user password' })
  readonly fullName?: string;
}

export default UpdateUserDto;
