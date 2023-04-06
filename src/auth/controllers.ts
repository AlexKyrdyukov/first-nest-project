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
  ApiHeader,
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
    @Body(new ValidationPipe({ whitelist: true })) dto: SignInUserDto,
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
  async signUp(
    @Body(new ValidationPipe({ whitelist: true })) dto: SignUpUserDto,
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
  @Roles('user') // add role
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
