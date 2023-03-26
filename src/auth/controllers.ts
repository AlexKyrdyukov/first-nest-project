import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
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
import { User } from 'src/user/user.decorator';
import { Roles } from '../roles/rolesDecorator';
import { ReturnSignInDto, SignInUserDto } from './dto/signInUserDto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DeviceIdDto } from './dto/deviceIdDto';

@ApiTags('auth api')
@Controller('auth')
@ApiHeader({ name: 'deviceId' })
class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  // @ApiOperation({
  //   summary: 'authorization user in system, return user with tokens',
  // })
  // @ApiBody({ type: SignInUserDto })
  // @ApiResponse({ status: 200, type: ReturnSignInDto })
  // @Post('sign-in')
  // async signIn(
  //   @Body(new JoiValidationPipe(signInSchema)) dto: SignInUserDto,
  //   @Headers() headers: DeviceIdDto,
  // ) {
  //   // return this.authService.signIn(dto, headers);
  // }

  @ApiOperation({ summary: 'created user with tokens' })
  @ApiBody({ type: SignInUserDto })
  @ApiResponse({ status: 201, type: ReturnSignInDto })
  @Post('sign-up')
  @Roles('admin') // add role
  async signUp(@Body() dto: SignInUserDto, @Headers() headers: DeviceIdDto) {
    // return this.commandBus.execute();
  }

  // @ApiParam({ name: 'userId' })
  // @ApiOperation({ summary: 'return user properties' })
  // @ApiResponse({ status: 200, type: UserEntity })
  // @Get('me')
  // @UseGuards(AuthGuard)
  // async getMe(@User() reqUser: UserEntity) {
  //   const { password, ...user } = reqUser;
  //   return user;
  // }

  // @ApiOperation({ summary: 'refresh user token' })
  // @ApiBody({ type: RefreshTokenDto })
  // @ApiResponse({ status: 201, type: RefreshRouteResponse })
  // @Post('refresh')
  // @UsePipes(new JoiValidationPipe(refreshSchema))
  // async refresh(
  //   @Body() dto: RefreshTokenDto,
  //   @Headers('device_id') deviceId: DeviceIdDto['device_id'],
  // ): Promise<RefreshRouteResponse> {
  //   return this.authService.refresh(dto, deviceId);
  // }
}

export default AuthController;
