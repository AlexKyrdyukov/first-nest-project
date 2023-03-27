import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

const validCategories = ['footbal', 'golf', 'basketball', 'live'];

export class CreatePostDto {
  @ApiProperty({ example: 'post content', description: 'post content' })
  @IsString({ message: 'must be only string' })
  @IsNotEmpty()
  @MaxLength(1000)
  @MinLength(2)
  readonly content: string;

  @ApiProperty({ example: 'post title', description: 'post title' })
  @IsString({ message: 'must be only string' })
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(2)
  readonly title: string;

  @ApiProperty({ example: 'post category', description: 'post category' })
  @IsString({ message: 'must be only string' })
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(2)
  readonly category: string;

  @ApiProperty({ example: '["football"]', description: 'post categories' })
  @IsNotEmpty()
  @IsIn(validCategories, { each: true })
  @Matches('^[a-zA-Z\\s]+$', undefined, { each: true })
  categories: string[];
}
