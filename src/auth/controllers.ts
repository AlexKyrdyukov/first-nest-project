import AuthService from './service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

type EnteredData = Record<string, string>;

@Controller('auth')
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() body: EnteredData, @Headers() headers: EnteredData) {
    return await this.authService.signIn(body, headers);
  }

  @Post('sign-up')
  async signUp(@Body() body: EnteredData, @Headers() headers: EnteredData) {
    return await this.authService.signUp(body, headers);
  }

  @Get('me')
  async getMe() {
    return await this.authService.getMe();
  }
}

export default AuthController;
