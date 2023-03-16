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
  async signIn(@Body() body: EnteredData) {
    return await this.authService.signIn(body);
  }

  @Post('sign-up')
  async signUp(@Body() body: EnteredData) {
    return await this.authService.signUp(body);
  }

  @Get('me')
  async getMe() {
    return await this.authService.getMe();
  }
}

export default AuthController;
