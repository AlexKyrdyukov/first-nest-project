import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsDefined,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserAddressDto {
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
  @IsDefined() // why dont work
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  @MinLength(2)
  street: string;
}
