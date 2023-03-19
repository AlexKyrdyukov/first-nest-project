import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import User from '../../db/entities/User';

export const signInSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(3).max(10).trim().required(),
}).options({
  abortEarly: false,
});

// export const signInSchema = {
//   body: {
//     email: Joi.string().email().trim().required(),
//     password: Joi.string().min(3).max(10).trim().required(),
//   },
// };

class SignInUserDto {
  @ApiProperty({ example: 'user@email.ru', description: 'email post address' })
  email: string;

  @ApiProperty({ example: '123qwerty', description: 'user password' })
  password: string;
}

export class ReturnSignInDto {
  @ApiProperty({
    example: User,
    description: 'user',
  })
  user: User;
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

export default SignInUserDto;
