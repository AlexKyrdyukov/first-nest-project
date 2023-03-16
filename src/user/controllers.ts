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

type EnteredData = Record<string, string>;

@Controller('user')
class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Post('create')
  async create(@Body() body: EnteredData): Promise<Partial<User>> {
    return await this.userService.create(body);
  }

  @Get('me/:userId')
  async findCurrent(@Param() param: EnteredData): Promise<User | null> {
    return await this.userService.findById(param);
  }

  @Delete(':userId')
  async delete(@Param() param: EnteredData) {
    return this.userService.delete(param);
  }

  @Patch('update')
  async patch(@Body() body: EnteredData) {
    return this.userService.update(body);
  }
}

export default UserController;
