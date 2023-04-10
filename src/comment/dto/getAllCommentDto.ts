import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class GetAllCommentDto {
  @ApiProperty({ example: 2, description: 'id post' })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  readonly postId: number;
}
