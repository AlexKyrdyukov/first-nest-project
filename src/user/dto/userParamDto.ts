import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class UserParamDto {
  @ApiProperty({ example: 24, description: 'user uniq identificator' })
  @IsInt()
  @IsPositive()
  userId: number;
}
