import UserService from './../user/service';
import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import TokenService from '../token/service';
import { Repository } from 'typeorm';
import User from '../db/entities/User';
import RefreshTokenDto, { DeviceIdDto } from './dto/refresh.dto';
import SignInUserDto from './dto/sign-in.dto';

type EnteredData = Record<string, string>;

@Injectable()
class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
  ) { }

  async signIn(body: SignInUserDto, headers: EnteredData) {
    console.log(headers);
    const deviceId = headers.device_id;
    const { email } = body;
    // const user = await this.userService.findByEmail({ email });
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: 'User with this email not found',
      });
    }
    this.userService.checkPassword(body.password, user.password);
    const { refreshToken, accessToken } = await this.tokenService.createTokens(
      String(user.userId),
      deviceId,
    );
    const { password, ...userFromDB } = user;

    return {
      accessToken,
      refreshToken,
      userFromDB,
    };
  }

  async signUp(body: SignInUserDto, headers: EnteredData) {
    const deviceId = headers.device_id;
    console.log(47, deviceId);
    const { email } = body;
    const existedUser = await this.userService.findByEmail({ email });
    if (existedUser) {
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: 'User with this email already exist',
      });
    }
    const user = await this.userService.createNewUser(body);
    const { refreshToken, accessToken } = await this.tokenService.createTokens(
      String(user.userId),
      deviceId,
    );

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async getMe() {
    return console.log('event');
  }

  async refresh(dto: RefreshTokenDto, deviceId: DeviceIdDto['device_id']) {

    const [auth, token] = dto.refreshToken?.split(' ');

    if (!deviceId || auth !== 'Bearer') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN); //unknown authorization type
    }
    const { userId } = await this.tokenService.verifyRefresh(deviceId, token);

    const { accessToken, refreshToken } = await this.tokenService.createTokens(
      userId,
      deviceId,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}

export default AuthService;
