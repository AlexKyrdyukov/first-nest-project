import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Get,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';

import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';

import UpdateUserPasswordDto, {
  updateUserPasswordSchema,
} from './dto/updateUserPassword.dto';

import UserService from './service';
import { User } from './user.decorator';
import UserEntity from '../db/entities/User';
import { AuthGuard } from '../auth/authGuard';
import UserParamDto from './dto/userParam.dto';
import { JoiValidationPipe } from './../pipes/validation-pipe';
import DeleteUserDto, { deleteUserSchema } from './dto/deleteUser.dto';
import UpdateUserDto, { updateUserSchema } from './dto/updateUserData.dto';
import SetAvatarUserDto, { setAvatarUserSchema } from './dto/setAvatar.dto';

@ApiTags('user api')
@Controller('user')
@ApiHeader({ name: 'deviceId' })
@UseGuards(AuthGuard)
class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'delete user' })
  @ApiParam({
    type: UserParamDto,
    name: 'userId',
  })
  @ApiResponse({ status: 204 })
  @Delete(':userId')
  async delete(
    @Param(new JoiValidationPipe(deleteUserSchema)) param: DeleteUserDto,
    @User() userDto: UserEntity,
  ) {
    return this.userService.delete(param, userDto);
  }

  @ApiOperation({ summary: 'update user password ' })
  @ApiBody({
    type: UpdateUserPasswordDto,
  })
  @ApiParam({
    type: UserParamDto,
    name: 'userId',
  })
  @ApiResponse({ status: 200 })
  @Patch(':userId/password')
  async patchUserPassword(
    @Body(new JoiValidationPipe(updateUserPasswordSchema))
    body: UpdateUserPasswordDto,
    @User() userDto: UserEntity,
  ) {
    return this.userService.updateUserPass(body, userDto);
  }

  @ApiOperation({ summary: 'update all user properties except password ' })
  @ApiBody({
    type: UpdateUserDto,
  })
  @ApiParam({
    type: UserParamDto,
    name: 'userId',
  })
  @ApiResponse({ status: 200, type: UserEntity })
  @Patch(':userId')
  async patchUserData(
    @Body(new JoiValidationPipe(updateUserSchema)) body: UpdateUserDto,
    @User() userDto: UserEntity,
  ) {
    return this.userService.update(body, userDto);
  }

  @ApiOperation({ summary: 'set user avatar' })
  @ApiBody({
    type: SetAvatarUserDto,
  })
  @ApiParam({
    type: UserParamDto,
    name: 'userId',
  })
  @ApiResponse({ status: 200, type: UserEntity })
  @Post(':userId/avatar')
  async setUserAvatar(
    @Body(new JoiValidationPipe(setAvatarUserSchema)) body: SetAvatarUserDto,
    @User() userDto: UserEntity,
  ) {
    return this.userService.update(body, userDto);
  }
}

export default UserController;
