import { PatchDataCommand } from './commands/implementations/patchData';
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
  ValidationPipe,
} from '@nestjs/common';

import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';

import { User } from './user.decorator';
import UserEntity from '../db/entities/User';
import { AuthGuard } from '../auth/authGuard';
import { UserParamDto } from './dto/userParamDto';
import { DeleteUserDto } from './dto/deleteUserDto';
import { PatchDataDto } from './dto/patchDataDto';
import { PatchPasswordDto } from './dto/patchPassword.dto';
import { SetAvatarUserDto } from './dto/setAvatarDto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@ApiTags('user api')
@Controller('user')
@ApiHeader({ name: 'deviceId' })
@UseGuards(AuthGuard)
class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // @ApiOperation({ summary: 'delete user' })
  // @ApiParam({
  //   type: UserParamDto,
  //   name: 'userId',
  // })
  // @ApiResponse({ status: 204 })
  // @Delete(':userId')
  // async delete(@Param() param: DeleteUserDto, @User() userDto: UserEntity) {
  //   // return this.userService.delete(userDto);
  // }

  // @ApiOperation({ summary: 'update user password ' })
  // @ApiBody({
  //   type: PatchPasswordDto,
  // })
  // @ApiParam({
  //   type: UserParamDto,
  //   name: 'userId',
  // })
  // @ApiResponse({ status: 200 })
  // @Patch(':userId/password')
  // async patchUserPassword(
  //   @Body()
  //   body: PatchPasswordDto,
  //   @User() userDto: UserEntity,
  // ) {
  //   // return this.userService.updateUserPass(body, userDto);
  // }

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
  async patchUserData(
    @Body(new ValidationPipe({ skipMissingProperties: true }))
    body: PatchDataDto,
    @User() userDto: UserEntity,
  ) {
    return this.commandBus.execute(new PatchDataCommand(body, userDto));
  }

  // @ApiOperation({ summary: 'set user avatar' })
  // @ApiBody({
  //   type: SetAvatarUserDto,
  // })
  // @ApiParam({
  //   type: UserParamDto,
  //   name: 'userId',
  // })
  // @ApiResponse({ status: 200, type: UserEntity })
  // @Post(':userId/avatar')
  // async setUserAvatar(
  //   @Body() body: SetAvatarUserDto,
  //   @User() userDto: UserEntity,
  // ) {
  //   // return this.userService.update(body, us  erDto);
  // }
}

export default UserController;
