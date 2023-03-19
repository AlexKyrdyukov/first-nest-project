import UserService from './service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import User from 'src/db/entities/User';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

type EnteredData = Record<string, string>;

@ApiTags('user api')
@Controller('user')
class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get('all')
  // async findAll(): Promise<User[]> {
  //   return await this.userService.findAll();
  // }

  // @Post('create')
  // async create(@Body() body: EnteredData): Promise<Partial<User>> {
  //   return await this.userService.create(body);
  // }

  // @Get('me/:userId')
  // async findCurrent(@Param() param: EnteredData): Promise<User | null> {
  //   return await this.userService.findById(param);
  // }
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
  @ApiResponse({ status: 200, type: User })
  @Patch(':userId')
  async patch(@Body() body: EnteredData) {
    return this.userService.update(body);
  }
}

export default UserController;
