import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiHeader,
  ApiHeaders,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';

import UserEntity from '../db/entities/User';

import { User } from '../user/user.decorator';
import { Roles } from '../roles/rolesDecorator';
import { AuthGuard } from './authGuard';

import { DeviceIdDto } from './dto/deviceIdDto';
import { SignUpResponse, SignUpUserDto } from './dto/signUpUserDto';
import { SignInResponse, SignInUserDto } from './dto/signInUserDto';
import { RefreshResponse, RefreshTokenDto } from './dto/refreshDto';

import { SignUpUserCommand } from './commands/implementations/signUpUserCommand';
import { SignInUserCommand } from './commands/implementations/signInUserCommand';
import { RefreshUserCommand } from './commands/implementations/refreshUserCommand';

@Controller('auth')
@ApiTags('auth api')
class AuthController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('sign-in')
  @ApiOperation({
    summary: 'authorization user in system, return user with tokens',
  })
  @ApiBody({ type: SignInUserDto })
  @ApiResponse({ status: 200, type: SignInResponse })
  @ApiResponse({ status: 400, description: 'Error existen user' })
  @HttpCode(200)
  async signIn(
    @Body(new ValidationPipe({ whitelist: true })) dto: SignInUserDto,
    @Headers() headers: DeviceIdDto,
  ): Promise<SignInResponse> {
    return this.commandBus.execute(
      new SignInUserCommand(dto, headers.device_id),
    );
  }

  @Post('sign-up')
  @ApiOperation({ summary: 'created user with tokens' })
  @ApiBody({ type: SignUpUserDto })
  @ApiResponse({ status: 201, type: SignUpResponse })
  @ApiResponse({
    status: 400,
    description: 'user with this email already exist',
  })
  async signUp(
    @Body(new ValidationPipe({ whitelist: true })) dto: SignUpUserDto,
    @Headers() headers: DeviceIdDto,
  ): Promise<SignUpResponse> {
    return this.commandBus.execute(
      new SignUpUserCommand(dto, headers.device_id),
    );
  }

  @Get('me')
  @ApiOperation({ summary: 'return user properties' })
  @ApiResponse({ status: 200, type: UserEntity })
  @Roles('user') // add role
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'device_id',
    description: '12345',
    example: '12345',
    required: true,
  })
  async getMe(@User() reqUser: UserEntity) {
    const { password, comment, posts, ...user } = reqUser;
    return user;
  }

  @Post('refresh')
  @ApiOperation({ summary: 'refresh user token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 201, type: RefreshResponse })
  @ApiResponse({
    status: 401,
    description:
      'Unknown type authorization, please enter in application & repeat request',
  })
  async refresh(
    @Body(new ValidationPipe()) dto: RefreshTokenDto,
    @Headers() headers: DeviceIdDto,
  ): Promise<RefreshResponse> {
    return this.commandBus.execute(
      new RefreshUserCommand(dto, headers.device_id),
    );
  }
}

export default AuthController;
