import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserAddresDto {
  @ApiProperty({
    example: 'user@email.ru',
    description: 'email post address',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  @MinLength(2)
  country: string;

  @ApiProperty({
    example: 'New York',
    description: 'city of location',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  @MinLength(2)
  city: string;

  @ApiProperty({
    example: 'Obema chmo street',
    description: 'stret of location',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  @MinLength(2)
  street: string;
}
