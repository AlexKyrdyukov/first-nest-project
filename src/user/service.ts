import { Injectable, Inject, Param } from '@nestjs/common';
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
    console.log(15, body);
    const user = await this.newUser(body);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(@Param() id: string): Promise<User | null> {
    console.log(id);
    return await this.userRepository.findOne({
      where: {
        userId: Number(id),
      },
    });
  }

  async delete(@Param() param: EnteredData) {
    console.log(param);
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
      // throw Exception.createError(errorTypes.BAD_REQUEST_INVALID_PASSWORD);
    }
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
