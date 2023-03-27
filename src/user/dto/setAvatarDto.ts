import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SetAvatarUserDto {
  @ApiProperty({
    example:
      'https://ru.wikipedia.org/wiki/%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA_%D0%BA%D0%BE%D0%B4%D0%BE%D0%B2_%D1%81%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%B8%D1%8F_HTTP#409',
    description: 'link on user avatar',
  })
  @IsString({ message: 'must be only string' })
  @IsNotEmpty()
  @MaxLength(200, {
    message:
      'must be no shorter than 3 characters and no longer than 11 characters',
  })
  @MinLength(3, {
    message:
      'must be no shorter than 3 characters and no longer than 11 characters',
  })
  avatar: string;
}
