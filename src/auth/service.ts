import UserService from './../user/service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import User from 'src/db/entities/User';
import { Repository } from 'typeorm';
import TokenService from '../token/service';

type EnteredData = Record<string, string>;

@Injectable()
class AuthService {
  constructor(
    // @Inject('tokenService')
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  async signIn(body: EnteredData, headers: EnteredData) {
    console.log(headers);
    const { deviceId } = headers;
    const { email } = body;
    const user = await this.userService.findByEmail({ email });
    console.log(user);
    if (!user) {
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: 'User with this email not found',
      });
    }
    this.userService.checkPassword(body.password, user.password);
    const { refreshToken, accessToken, a } =
      await this.tokenService.createTokens(String(user.userId), deviceId);
    const { password, ...userFromDB } = user;

    return {
      accessToken,
      refreshToken,
      userFromDB,
      a,
    };
  }

  async signUp(body: EnteredData, headers: EnteredData) {
    console.log(47);
    const { deviceId } = headers;
    const { email } = body;
    const existedUser = await this.userService.findByEmail({ email });
    if (existedUser) {
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: 'User with this email already exist',
      });
    }
    const user = await this.userService.createNewUser(body);
    console.log(52, email);
    const { refreshToken, accessToken, a } =
      await this.tokenService.createTokens(String(user.userId), deviceId);

    console.log(user);
    return {
      accessToken,
      refreshToken,
      user,
      a,
    };
  }

  async getMe() {};
}

export default AuthService;
