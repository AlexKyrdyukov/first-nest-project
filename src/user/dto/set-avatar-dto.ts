import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export const setAvatarUserSchema = Joi.object({
  avatar: Joi.string().trim().required(),
});

class SetAvatarUserDto {
  @ApiProperty({ example: '24', description: 'link on user avatar' })
  avatar: string;
}

export default SetAvatarUserDto;
