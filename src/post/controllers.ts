import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import PostEntity from '../db/entities/Post';
import UserEntity from '../db/entities/User';

import { AuthGuard } from '../auth/authGuard';
import { RolesGuard } from '../roles/rolesGuard';
import { User } from '../user/user.decorator';
import { Roles } from '../roles/rolesDecorator';

import { CreatePostDto } from './dto/createPostDto';
import { UserParamDto } from '../user/dto/userParamDto';
import { CreatePostCommand } from './commands/implementations/createPostCommand';

@Controller('post')
@ApiTags('post api')
@ApiHeader({ name: 'device_id' })
@ApiBearerAuth('access-token')
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
  @Roles('admin', 'user', 'intern', 'develop') // add role
  async createPost(
    @Body(new ValidationPipe({ whitelist: true })) body: CreatePostDto,
    @User() userDto: UserEntity,
  ) {
    return this.commandBus.execute(new CreatePostCommand(body, userDto));
  }
}
