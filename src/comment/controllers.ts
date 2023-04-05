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
import { CreateCommentDto } from './dto/createCommentDto';
import { Roles } from '../roles/rolesDecorator';
import { User } from '../user/user.decorator';
import UserEntity from '../db/entities/User';
import { CreateCommentCommand } from './commands/implementations/createCommentCommand';

@ApiTags('comment api')
@Controller('comment')
@ApiHeader({ name: 'deviceId' })
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
  @Post('/create')
  @Roles('admin, user, intern') // add role
  async createComment(
    @Body(new ValidationPipe({ whitelist: true }))
    body: CreateCommentDto,
    @User() userDto: UserEntity,
  ) {
    return this.commandBus.execute(new CreateCommentCommand(body, userDto));
  }
}
