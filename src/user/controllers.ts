import { CreatePostCommand } from './commands/implementations/createPostCommand';
import { PatchDataCommand } from './commands/implementations/patchDataCommand';
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

import { User } from './user.decorator';
import UserEntity from '../db/entities/User';
import { AuthGuard } from '../auth/authGuard';
import { UserParamDto } from './dto/userParamDto';
import { DeleteUserDto } from './dto/deleteUserDto';
import { PatchDataDto } from './dto/patchDataDto';
import { PatchPasswordDto } from './dto/patchPassword.dto';
import PostEntity from '../db/entities/Post';
import { SetAvatarUserDto } from './dto/setAvatarDto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PatchPasswordCommand } from './commands/implementations/patchPasswordCommand';
import { RemoveUserCommand } from './commands/implementations/removeUserCommand';
import { SetAvatarCommand } from './commands/implementations/setAvatarCommand';
import { CreatePostDto } from './dto/createPostDto';
import { CreateCommentDto } from './dto/createCommentDto';
import { CreateCommentCommand } from './commands/implementations/createCommentCommand';

@ApiTags('user api')
@Controller('user')
@ApiHeader({ name: 'deviceId' })
@UseGuards(AuthGuard)
class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiOperation({ summary: 'delete user' })
  @ApiParam({
    type: UserParamDto,
    name: 'userId',
  })
  @ApiResponse({ status: 204 })
  @Delete(':userId')
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
  async patchUserPassword(
    @Body(new ValidationPipe())
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
  async patchUserData(
    @Body(new ValidationPipe({ skipMissingProperties: true }))
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
  @ApiResponse({ status: 200, type: UserEntity })
  @Post(':userId/avatar')
  async setUserAvatar(
    @Body(new ValidationPipe()) body: SetAvatarUserDto,
    @User() userDto: UserEntity,
  ) {
    return this.commandBus.execute(new SetAvatarCommand(body.avatar, userDto));
  }

  @ApiOperation({ summary: 'create post' })
  @ApiBody({
    type: CreatePostDto, // postdto
  })
  @ApiParam({
    type: UserParamDto,
    name: 'userId',
  })
  @ApiResponse({ status: 200, type: PostEntity })
  @Post(':userId/post')
  async createPost(
    @Body(new ValidationPipe()) body: CreatePostDto,
    @User() userDto: UserEntity,
  ) {
    return this.commandBus.execute(new CreatePostCommand(body, userDto));
  }

  @ApiOperation({ summary: 'create comment' })
  @ApiBody({
    type: CreateCommentDto,
  })
  @ApiParam({
    type: UserParamDto,
    name: 'userId',
  })
  @ApiResponse({ status: 200, type: PostEntity })
  @Post(':userId/comment')
  async createComment(
    @Body(new ValidationPipe()) body: CreateCommentDto,
    @User() userDto: UserEntity,
  ) {
    return this.commandBus.execute(new CreateCommentCommand(body, userDto));
  }
}

export default UserController;
