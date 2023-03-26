import { ApiProperty } from '@nestjs/swagger';

export class DeviceIdDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.',
    description: 'user device id',
  })
  device_id: string;
}
