import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

export class DeviceIdDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.',
    description: 'user device id',
  })
  device_id: string;
}

class RefreshTokenDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.',
    description: 'user refresh token',
  })
  refreshToken: string;
}

export class RefreshRouteResponse {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.',
    description: 'user access token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.',
    description: 'user refres token',
  })
  refreshToken: string;
}

export default RefreshTokenDto;
