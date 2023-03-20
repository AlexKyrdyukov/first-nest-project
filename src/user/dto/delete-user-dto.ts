import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export const deleteUserSchema = Joi.object({
  userId: Joi.number().positive().required(),
});

class DeleteUserDto {
  @ApiProperty({ example: '24', description: 'user uniq identificator' })
  userId: number;
}

export default DeleteUserDto;
