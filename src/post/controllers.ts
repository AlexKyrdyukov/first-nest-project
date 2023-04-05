import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import PostEntity from '../db/entities/Post';
import { UserParamDto } from '../user/dto/userParamDto';
import { AuthGuard } from '../auth/authGuard';
import { RolesGuard } from '../roles/rolesGuard';
import { Roles } from '../roles/rolesDecorator';
import { User } from '../user/user.decorator';
import UserEntity from '../db/entities/User';
import { CreatePostCommand } from './commands/implementations/createPostCommand';
import { CreatePostDto } from './dto/createPostDto';

@ApiTags('post api')
@Controller('post')
@ApiHeader({ name: 'deviceId' })
@UseGuards(AuthGuard, RolesGuard)
export class PostControllers {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'create post' })
  @ApiBody({
    type: CreatePostDto, // postdto
  })
  @ApiParam({
    type: UserParamDto,
    name: 'userId',
  })
  @ApiResponse({ status: 200, type: PostEntity })
  @Post('create')
  @Roles('admin, user, intern') // add role
  async createPost(
    @Body(new ValidationPipe({ whitelist: true })) body: CreatePostDto,
    @User() userDto: UserEntity,
  ) {
    return this.commandBus.execute(new CreatePostCommand(body, userDto));
  }
}
