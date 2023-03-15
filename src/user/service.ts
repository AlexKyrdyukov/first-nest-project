import {
  Injectable,
  Inject,
  Param,
  HttpException,
  BadRequestException,
  Body,
  HttpStatus,
} from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import { Repository } from 'typeorm';
import User from 'src/db/entities/User';
import config from '../config';

type EnteredData = Record<string, string>;

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async create(body: EnteredData) {
    try {
      const { email } = body;
      const user = await this.userRepository.findOne({
        where: {
          email,
        },
      });
      if (user) {
        throw new BadRequestException('Error', {
          cause: new Error(),
          description: 'Entered password invalid',
        });
      }
      return await this.newUser(body);
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(@Param() param: EnteredData): Promise<User | null> {
    const { userId } = param;
    return await this.userRepository.findOne({
      where: {
        userId: Number(userId),
      },
    });
  }

  async delete(@Param() param: EnteredData) {
    const { id } = param;
    const user = await this.findOne({ userId: id });
    if (!user) {
      return;
    }
    await this.userRepository.remove(user);
  }

  hashPassword(password: string) {
    return CryptoJS[config.hash.algorithm](
      password,
      config.hash.salt,
    ).toString();
  }

  checkPassword(newPassword: string, oldPassword: string) {
    const verification =
      CryptoJS[config.hash.algorithm](
        newPassword,
        config.hash.salt,
      ).toString() === oldPassword;
    if (!verification) {
      // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: 'Entered password invalid',
      });
    }
  }

  async update(@Body() body: Partial<User>) {
    const { userId } = body;
    const updateUser = await this.findOne({ userId: String(userId) });
    if (!updateUser) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    let newUser: Record<string, string | number | Date> = {};
    Object.entries(body).forEach(([key, value]) => {
      let newValue = value;
      if (key === 'password') {
        newValue = this.hashPassword(value as string);
      }
      newUser = {
        ...updateUser,
        [key]: newValue,
      };
    });

    await this.userRepository.save(newUser);
    delete newUser.password;
    return newUser;
  }

  async newUser(params: Partial<User>) {
    let user: Partial<User> = new User();

    Object.entries(params).forEach(([key, value]) => {
      let currentValue = value;

      if (key === 'password') {
        currentValue = this.hashPassword(value as string);
      }
      user = {
        ...user,
        [key]: currentValue,
      };
    });

    await this.userRepository.save(user);
    delete user.password;
    return user;
  }
}
