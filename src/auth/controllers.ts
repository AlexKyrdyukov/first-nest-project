import AuthService from './service';
import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import RefreshTokenDto, {
  DeviceIdDto,
  RefreshRouteResponse,
} from './dto/refresh.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import SignInUserDto from './dto/sign-in.dto';
import User from '../db/entities/User';
import { JoiValidationPipe } from '../pipes/validation-pipe';
import { signInSchema, ReturnSignInDto } from './dto/sign-in.dto';
import { refreshSchema } from './dto/refresh.dto';

type EnteredData = Record<string, string>;

@ApiTags('auth api')
@Controller('auth')
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'authorization user in system, return user with tokens',
  })
  @ApiResponse({ status: 200, type: ReturnSignInDto })
  @Post('sign-in')
  @UsePipes(new JoiValidationPipe(signInSchema))
  async signIn(
    @Req() req: string,
    @Body() dto: SignInUserDto,
    @Headers() headers: EnteredData,
  ) {
    console.log(req);
    return await this.authService.signIn(dto, headers);
  }

  @ApiOperation({ summary: 'created user with tokens' })
  @ApiResponse({ status: 201, type: ReturnSignInDto })
  @Post('sign-up')
  @UsePipes(new JoiValidationPipe(signInSchema))
  async signUp(@Body() dto: SignInUserDto, @Headers() headers: EnteredData) {
    console.log(dto);
    return await this.authService.signUp(dto, headers);
  }

  @ApiOperation({ summary: 'user properties' })
  @ApiResponse({ status: 200, type: User })
  @Get('me')
  async getMe() {
    return await this.authService.getMe();
  }

  @ApiOperation({ summary: 'refresh user token' })
  @ApiResponse({ status: 201, type: RefreshRouteResponse })
  @Post('refresh')
  @UsePipes(new JoiValidationPipe(refreshSchema))
  async refresh(
    @Req() req: Request,
    @Body() dto: RefreshTokenDto,
    @Headers('device_id') deviceId: DeviceIdDto['device_id'],
  ): Promise<RefreshRouteResponse> {
    console.log(dto, req);
    return await this.authService.refresh(dto, deviceId);
  }
}

export default AuthController;
