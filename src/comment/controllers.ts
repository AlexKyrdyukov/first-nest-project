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

import { CreateCommentDto } from './dto/createCommentDto';
import { UserParamDto } from '../user/dto/userParamDto';
import { CreateCommentCommand } from './commands/implementations/createCommentCommand';

@Controller('comment')
@ApiTags('comment api')
@ApiBearerAuth('access-token')
@ApiHeader({ name: 'device_id' })
@UseGuards(AuthGuard, RolesGuard)
export class CommentControllers {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'create comment' })
  @ApiBody({
    type: CreateCommentDto,
  })
  @ApiParam({
    type: UserParamDto,
    name: 'userId',
  })
  @ApiResponse({ status: 200, type: PostEntity })
  @ApiResponse({
    status: 400,
    description: 'This post not found please check data & repeat request',
  })
  @Post('/create')
  @Roles('admin', 'user', 'intern') // add role
  async createComment(
    @Body(new ValidationPipe({ whitelist: true }))
    body: CreateCommentDto,
    @User() userDto: UserEntity,
  ) {
    return this.commandBus.execute(new CreateCommentCommand(body, userDto));
  }
}
