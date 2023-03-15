import { UserService } from './service';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
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
  async create(@Body() body: EnteredData): Promise<void> {
    const { email, password } = body;
    return await this.userService.create(body);
  }

  @Get('me/:userId')
  async findCurrent(@Param() param: EnteredData): Promise<User | null> {
    const { userId } = param;
    return await this.userService.findOne(userId);
  }

  @Delete(':id')
  async delete(@Param() param: EnteredData) {
    // const { userId } = param;
    return this.userService.delete(param);
  }
}

export default UserController;
