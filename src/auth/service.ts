import UserService from './../user/service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import User from 'src/db/entities/User';
import { Repository } from 'typeorm';
import TokenService from '../token/service';

type EnteredData = Record<string, string>;

@Injectable()
class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  async signIn(body: EnteredData) {
    try {
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
        await this.tokenService.createTokens(String(user.userId));
      const { password, ...userFromDB } = user;

      return {
        accessToken,
        refreshToken,
        userFromDB,
        a,
      };
    } catch (error) {
      throw error;
    }
  }

  async signUp(body: EnteredData) {
    try {
      const { email } = body;
      const existedUser = await this.userRepository.findOne({
        where: {
          email,
        },
      });
      if (existedUser) {
        throw new BadRequestException('Error', {
          cause: new Error(),
          description: 'User with this email already exist',
        });
      }
      const user = await this.userService.createNewUser(body);
      const { refreshToken, accessToken, a } =
        await this.tokenService.createTokens(String(user.userId));
      // const { password, ...userFromDB } = user;

      return {
        accessToken,
        refreshToken,
        user,
        a,
      };
    } catch (error) {}
  }

  async getMe() {
    try {
    } catch (error) {}
  }
}

export default AuthService;
