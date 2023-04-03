import { RefreshUserCommand } from './commands/implementations/refreshUserCommand';
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';

import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthGuard } from './authGuard';
import UserEntity from '../db/entities/User';
import { User } from '../user/user.decorator';
import { Roles } from '../roles/rolesDecorator';
import { SignUpResponse, SignUpUserDto } from './dto/signUpUserDto';
import { CommandBus } from '@nestjs/cqrs';
import { DeviceIdDto } from './dto/deviceIdDto';
import { SignUpUserCommand } from './commands/implementations/signUpUserCommand';
import { SignInResponse, SignInUserDto } from './dto/signInUserDto';
import { SignInUserCommand } from './commands/implementations/signInUserCommand';
import { RefreshResponse, RefreshTokenDto } from './dto/refreshDto';
// import { Request } from 'express';

@ApiTags('auth api')
@ApiHeader({ name: 'deviceId' })
@Controller('auth')
class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({
    summary: 'authorization user in system, return user with tokens',
  })
  @ApiBody({ type: SignInUserDto })
  @ApiResponse({ status: 200, type: SignInResponse })
  @Post('sign-in')
  @HttpCode(200)
  async signIn(
    @Body(new ValidationPipe()) dto: SignInUserDto,
    @Headers() headers: DeviceIdDto,
  ): Promise<SignInResponse> {
    return this.commandBus.execute(
      new SignInUserCommand(dto, headers.device_id),
    );
  }

  @ApiOperation({ summary: 'created user with tokens' })
  @ApiBody({ type: SignUpUserDto })
  @ApiResponse({ status: 201, type: SignUpResponse })
  @Post('sign-up')
  @Roles('admin') // add role
  async signUp(
    @Body(new ValidationPipe()) dto: SignUpUserDto,
    @Headers() headers: DeviceIdDto,
  ): Promise<SignUpResponse> {
    return this.commandBus.execute(
      new SignUpUserCommand(dto, headers.device_id),
    );
  }

  @ApiParam({ name: 'userId' })
  @ApiOperation({ summary: 'return user properties' })
  @ApiResponse({ status: 200, type: UserEntity })
  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@User() reqUser: UserEntity) {
    const { password, comment, posts, ...user } = reqUser;
    return user;
  }

  @ApiOperation({ summary: 'refresh user token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 201, type: RefreshResponse })
  @Post('refresh')
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
