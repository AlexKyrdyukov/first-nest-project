import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import UserService from '../user/service';
import TokenService from '../token/service';

import UserEntity from '../db/entities/User';
import SignInUserDto from './dto/signIn.dto';
import RefreshTokenDto, { DeviceIdDto } from './dto/refresh.dto';

@Injectable()
class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) { }

  async signIn(body: SignInUserDto, headers: DeviceIdDto) {
    const deviceId = headers.device_id;
    const { email } = body;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .addSelect('user.salt')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new HttpException(
        'user with this email not found please checked entered data',
        HttpStatus.NOT_FOUND,
      );
    }
    this.userService.checkPassword(body.password, user.password, user.salt);

    const { refreshToken, accessToken } = await this.tokenService.createTokens(
      String(user.userId),
      deviceId,
    );
    const { password, salt, ...userFromDB } = user;

    return {
      accessToken,
      refreshToken,
      user: userFromDB,
    };
  }

  // async signUp(body: SignInUserDto, headers: DeviceIdDto) {
  //   const deviceId = headers.device_id;
  //   const { email } = body;
  //   const existedUser = await this.userService.findByEmail({ email });
  //   if (existedUser) {
  //     throw new HttpException(
  //       'user with this email already exist',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   const user = await this.userService.createNewUser(body);
  //   const { refreshToken, accessToken } = await this.tokenService.createTokens(
  //     String(user.userId),
  //     deviceId,
  //   );

  //   return {
  //     accessToken,
  //     refreshToken,
  //     user,
  //   };
  // }

  async register(registrationData: SignInUserDto, headers: DeviceIdDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: registrationData.email,
      },
    });
    if (user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const data = this.userService.hashPassword(registrationData.password);
    try {
      const createdUser = this.userRepository.create({
        ...registrationData,
        password: data.hash,
        salt: data.salt,
      });
      // createdUser.password = undefined;
      return createdUser;
      const { salt, password, ...user } = createdUser;
      return user;
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refresh(dto: RefreshTokenDto, deviceId: DeviceIdDto['device_id']) {
    const [auth, token] = dto.refreshToken?.split(' ');

    if (!deviceId || !deviceId.length || auth !== 'Bearer') {
      throw new HttpException(
        'Unknown type authorization, please enter in application & repeat request',
        HttpStatus.UNAUTHORIZED,
      );
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
