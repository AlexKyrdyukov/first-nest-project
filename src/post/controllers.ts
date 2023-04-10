import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

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
import { GetAllPostDto } from './dto/getAllPostDto';
import { GetAllPostQuery } from './query/implementations/getAllPostQuery';

@Controller('post')
@ApiTags('post api')
@ApiHeader({ name: 'device_id' })
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
export class PostControllers {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

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

  @ApiOperation({ summary: 'get all comments with post' })
  @ApiBody({
    type: GetAllPostDto,
  })
  @ApiResponse({ status: 200, type: [PostEntity] })
  @ApiResponse({
    status: 400,
    description: 'This post not found',
  })
  @Get('/')
  @Roles('admin') // add role
  async getAll(
    @Body(new ValidationPipe({ whitelist: true }))
    body: GetAllPostDto,
  ) {
    return this.queryBus.execute(new GetAllPostQuery(body));
  }
}
