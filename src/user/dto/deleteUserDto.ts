import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({ example: 24, description: 'user uniq identificator' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
