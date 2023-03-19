import AuthService from './service';
import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import RefreshTokenDto, {
  DeviceIdDto,
  RefreshRouteResponse,
} from './dto/refresh.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import SignInUserDto from './dto/sign-in.dto';
import UserEntity from '../db/entities/User';
import { JoiValidationPipe } from '../pipes/validation-pipe';
import { signInSchema, ReturnSignInDto } from './dto/sign-in.dto';
import { refreshSchema } from './dto/refresh.dto';
import { AuthGuard } from './auth-guard';
import { User } from 'src/user/user.decorator';

type EnteredData = Record<string, string>;

@ApiTags('auth api')
@Controller('auth')
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'authorization user in system, return user with tokens',
  })
  @ApiBody({ type: SignInUserDto })
  @ApiResponse({ status: 200, type: ReturnSignInDto })
  @Post('sign-in')
  @UsePipes(new JoiValidationPipe(signInSchema))
  async signIn(@Body() dto: SignInUserDto, @Headers() headers: EnteredData) {
    return await this.authService.signIn(dto, headers);
  }

  @ApiOperation({ summary: 'created user with tokens' })
  @ApiBody({ type: SignInUserDto })
  @ApiResponse({ status: 201, type: ReturnSignInDto })
  @Post('sign-up')
  @UsePipes(new JoiValidationPipe(signInSchema))
  async signUp(@Body() dto: SignInUserDto, @Headers() headers: EnteredData) {
    console.log(dto);
    return await this.authService.signUp(dto, headers);
  }

  @ApiParam({ name: 'userId' })
  @ApiOperation({ summary: 'return user properties' })
  @ApiResponse({ status: 200, type: UserEntity })
  @Get('me/:userId')
  @UsePipes(new JoiValidationPipe(refreshSchema))
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
    return await this.authService.refresh(dto, deviceId);
  }
}

export default AuthController;
