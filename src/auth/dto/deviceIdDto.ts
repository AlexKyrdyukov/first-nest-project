import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class DeviceIdDto {
  @ApiProperty({
    example: '12345',
    description: 'user device id',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  device_id: string;
}
