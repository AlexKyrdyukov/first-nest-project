import { ApiProperty } from '@nestjs/swagger';

class UserParamDto {
  @ApiProperty({ example: 24, description: 'user uniq identificator' })
  userId: number;
}

export default UserParamDto;
