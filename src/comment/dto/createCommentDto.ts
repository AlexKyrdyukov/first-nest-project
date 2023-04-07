import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'comment content', description: 'comment content' })
  @IsString({ message: 'must be only string' })
  @IsNotEmpty()
  @MaxLength(1000)
  @MinLength(2)
  readonly content: string;

  @ApiProperty({ example: 2, description: 'id post' })
  @IsInt()
  @IsPositive()
  readonly postId: number;
}
