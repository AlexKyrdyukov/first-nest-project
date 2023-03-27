import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class DeviceIdDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.',
    description: 'user device id',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  device_id: string;
}
