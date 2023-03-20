import UserService from './service';
import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { User } from './user.decorator';
import UserEntity from 'src/db/entities/User';

import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth-guard';
import UpdateUserDto, { updateUserSchema } from './dto/update-user-data.dto';
import { JoiValidationPipe } from './../pipes/validation-pipe';
import UpdateUserPasswordDto, {
  updateUserPasswordSchema,
} from './dto/update-user-password.dto';
import DeleteUserDto, { deleteUserSchema } from './dto/delete-user-dto';

@ApiTags('user api')
@Controller('user')
@UseGuards(AuthGuard)
class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'delete user' })
  @ApiParam({
    type: DeleteUserDto,
    name: 'userId',
  })
  @ApiResponse({ status: 204 })
  @Delete(':userId')
  @UsePipes(new JoiValidationPipe(deleteUserSchema))
  async delete(@Param() param: DeleteUserDto, @User() userDto: UserEntity) {
    return this.userService.delete(param, userDto);
  }

  @ApiOperation({ summary: 'update user password ' })
  @ApiBody({
    type: UpdateUserPasswordDto,
  })
  @ApiParam({
    type: DeleteUserDto,
    name: 'userId',
  })
  @ApiResponse({ status: 200 })
  @Patch(':userId/password')
  @UsePipes(new JoiValidationPipe(updateUserPasswordSchema))
  async patchPassword(
    @Body() body: UpdateUserPasswordDto,
    @User() userDto: UserEntity,
  ) {
    return this.userService.update(body, userDto);
  }

  @ApiOperation({ summary: 'update all user properties except password ' })
  @ApiBody({
    type: UpdateUserDto,
  })
  @ApiParam({
    type: DeleteUserDto,
    name: 'userId',
  })
  @ApiResponse({ status: 200, type: UserEntity })
  @Patch(':userId')
  @UsePipes(new JoiValidationPipe(updateUserSchema))
  async patch(@Body() body: UpdateUserDto, @User() userDto: UserEntity) {
    return this.userService.update(body, userDto);
  }
}

export default UserController;
