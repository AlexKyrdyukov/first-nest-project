import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export const updateUserPasswordSchema = Joi.object({
  password: Joi.string().trim().min(3).max(10).required(),
  newPassword: Joi.string().trim().min(3).max(10).required(),
}).options({
  abortEarly: false,
});

class UpdateUserPasswordDto {
  @ApiProperty({ example: '123qwerty', description: 'user password' })
  readonly password: string;

  @ApiProperty({ example: '123qwerty', description: 'user new password' })
  readonly newPassword: string;
}

export default UpdateUserPasswordDto;
