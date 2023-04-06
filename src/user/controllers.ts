import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
  HttpCode,
} from '@nestjs/common';

import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';

import UserEntity from '../db/entities/User';
import { User } from './user.decorator';
import { Roles } from '../roles/rolesDecorator';

import { AuthGuard } from '../auth/authGuard';
import { RolesGuard } from '../roles/rolesGuard';

import { UserParamDto } from './dto/userParamDto';
import { DeleteUserDto } from './dto/deleteUserDto';
import { PatchDataDto } from './dto/patchDataDto';
import { PatchPasswordDto } from './dto/patchPassword.dto';
import { SetAvatarUserDto } from './dto/setAvatarDto';

import { PatchDataCommand } from './commands/implementations/patchDataCommand';
import { SetAvatarCommand } from './commands/implementations/setAvatarCommand';
import { RemoveUserCommand } from './commands/implementations/removeUserCommand';
import { PatchPasswordCommand } from './commands/implementations/patchPasswordCommand';

@ApiTags('user api')
@Controller('user')
@ApiHeader({ name: 'deviceId' })
@UseGuards(AuthGuard, RolesGuard)
export class UserControllers {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'delete user' })
  @ApiParam({
    type: UserParamDto,
    name: 'userId',
  })
  @ApiResponse({ status: 204 })
  @Delete(':userId')
  @Roles('admin') // add role
  async delete(
    @Param(new ValidationPipe()) param: DeleteUserDto,
    @User() userDto: UserEntity,
  ) {
    return this.commandBus.execute(new RemoveUserCommand(userDto));
  }

  @ApiOperation({ summary: 'update user password ' })
  @ApiBody({
    type: PatchPasswordDto,
  })
  @ApiParam({
    type: UserParamDto,
    name: 'userId',
  })
  @ApiResponse({ status: 200 })
  @Patch(':userId/password')
  @HttpCode(204)
  @Roles('admin', 'user', 'intern') // add role
  async patchUserPassword(
    @Body(new ValidationPipe({ whitelist: true }))
    body: PatchPasswordDto,
    @User() userDto: UserEntity,
  ) {
    return this.commandBus.execute(new PatchPasswordCommand(body, userDto));
  }

  @ApiOperation({ summary: 'update all user properties except password ' })
  @ApiBody({
    type: PatchDataDto,
  })
  @ApiParam({
    type: UserParamDto,
    name: 'userId',
  })
  @ApiResponse({ status: 200, type: UserEntity })
  @Patch(':userId')
  @Roles('admin', 'user', 'intern') // add role
  async patchUserData(
    @Body(new ValidationPipe({ skipMissingProperties: true, whitelist: true }))
    body: PatchDataDto,
    @User() userDto: UserEntity,
  ) {
    return this.commandBus.execute(new PatchDataCommand(body, userDto));
  }

  @ApiOperation({ summary: 'set user avatar' })
  @ApiBody({
    type: SetAvatarUserDto,
  })
  @ApiParam({
    type: UserParamDto,
    name: 'userId',
  })
  @HttpCode(200)
  @ApiResponse({ status: 200, type: UserEntity })
  @Post(':userId/avatar')
  @Roles('admin', 'user', 'intern') // add role
  async setUserAvatar(
    @Body(new ValidationPipe({ whitelist: true })) body: SetAvatarUserDto,
    @User() userDto: UserEntity,
  ) {
    return this.commandBus.execute(new SetAvatarCommand(body.avatar, userDto));
  }
}
