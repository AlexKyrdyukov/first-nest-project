import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import RefreshTokenDto, {
  DeviceIdDto,
  RefreshRouteResponse,
} from './dto/refresh.dto';

import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import AuthService from './service';
import { AuthGuard } from './authGuard';
import UserEntity from '../db/entities/User';
import SignInUserDto from './dto/signIn.dto';
import { User } from 'src/user/user.decorator';
import { refreshSchema } from './dto/refresh.dto';
import { JoiValidationPipe } from '../pipes/validation-pipe';
import { signInSchema, ReturnSignInDto } from './dto/signIn.dto';
import { Roles } from '../roles/rolesDecorator';

@ApiTags('auth api')
@Controller('auth')
@ApiHeader({ name: 'deviceId' })
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'authorization user in system, return user with tokens',
  })
  @ApiBody({ type: SignInUserDto })
  @ApiResponse({ status: 200, type: ReturnSignInDto })
  @Post('sign-in')
  async signIn(
    @Body(new JoiValidationPipe(signInSchema)) dto: SignInUserDto,
    @Headers() headers: DeviceIdDto,
  ) {
    // return this.authService.signIn(dto, headers);
  }

  @ApiOperation({ summary: 'created user with tokens' })
  @ApiBody({ type: SignInUserDto })
  @ApiResponse({ status: 201, type: ReturnSignInDto })
  @Post('sign-up')
  @Roles('admin') // add role
  async signUp(
    @Body(new JoiValidationPipe(signInSchema)) dto: SignInUserDto,
    @Headers() headers: DeviceIdDto,
  ) {
    // return this.authService.signUp(dto, headers);
  }

  @ApiParam({ name: 'userId' })
  @ApiOperation({ summary: 'return user properties' })
  @ApiResponse({ status: 200, type: UserEntity })
  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@User() reqUser: UserEntity) {
    const { password, ...user } = reqUser;
    return user;
  }

  @ApiOperation({ summary: 'refresh user token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 201, type: RefreshRouteResponse })
  @Post('refresh')
  @UsePipes(new JoiValidationPipe(refreshSchema))
  async refresh(
    @Body() dto: RefreshTokenDto,
    @Headers('device_id') deviceId: DeviceIdDto['device_id'],
  ): Promise<RefreshRouteResponse> {
    return this.authService.refresh(dto, deviceId);
  }
}

export default AuthController;
