import UserService from './service';
import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { User } from './user.decorator';
import UserEntity from 'src/db/entities/User';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth-guard';

type EnteredData = Record<string, string>;

@ApiTags('user api')
@Controller('user')
@UseGuards(AuthGuard)
class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'delete user' })
  @ApiResponse({ status: 204 })
  @Delete(':userId')
  async delete(@Param() param: EnteredData) {
    return this.userService.delete(param);
  }

  @ApiOperation({ summary: 'update user password ' })
  @ApiResponse({ status: 200 })
  @Patch(':userId/password')
  async patchPassword(@Body() body: EnteredData) {
    return this.userService.update(body);
  }

  @ApiOperation({ summary: 'update all user properties except password ' })
  @ApiResponse({ status: 200, type: UserEntity })
  @Patch(':userId')
  async patch(@Body() body: EnteredData) {
    return this.userService.update(body);
  }
}

export default UserController;
