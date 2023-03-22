import {
  Injectable,
  HttpException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as crypto from 'crypto';
import { Repository } from 'typeorm';

import UserEntity from '../db/entities/User';
import config from '../config';
import DeleteUserDto from './dto/deleteUser.dto';
import UpdateUserPasswordDto from './dto/updateUserPassword.dto';

type EnteredData = Record<string, string>;

@Injectable()
class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  // todo: rename
  typeConfirmation(value: string | number | Date): value is string {
    return (value as string)?.length !== undefined;
  }

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
          description: 'User with this email already exist',
        });
      }
      return this.createNewUser(body);
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findById(params: EnteredData): Promise<UserEntity | null> {
    const { userId } = params;
    return this.userRepository.findOne({
      where: {
        userId: Number(userId),
      },
    });
  }

  async findByEmail(params: EnteredData): Promise<UserEntity | null> {
    const { email } = params;
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async delete(user: UserEntity) {
    return this.userRepository.remove(user);
  }

  hashPassword(password: string) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, config.hash.algorithm)
      .toString('hex');
    return {
      salt,
      hash,
    };
  }

  checkPassword(newPassword: string, oldPassword: string, salt: string) {
    const verification =
      crypto
        .pbkdf2Sync(newPassword, salt, 1000, 64, config.hash.algorithm)
        .toString('hex') === oldPassword;
    if (!verification) {
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: 'Entered password invalid',
      });
    }
  }

  async updateUserPass(body: UpdateUserPasswordDto, user: UserEntity) {
    const { password, newPassword } = body;
    this.checkPassword(password, user.password, user.salt);
    this.update({ password: newPassword }, user);
  }

  async update(body: Partial<UserEntity>, user: UserEntity) {
    let updateUser = user;

    Object.entries(body).forEach(([key, value]) => {
      let newValue = value;
      if (key === 'password') {
        const { salt, hash } = this.hashPassword(value as string);
        newValue = hash;
        updateUser.salt = salt;
      }
      updateUser = {
        ...updateUser,
        [key]: newValue,
      };
    });

    const { password, salt, ...savedUser } = await this.userRepository.save(
      updateUser,
    );
    return savedUser;
  }

  async createNewUser(params: Partial<UserEntity>) {
    let user: Partial<UserEntity> = new UserEntity();

    Object.entries(params).forEach(([key, value]) => {
      let currentValue = value;

      if (key === 'password' && this.typeConfirmation(value)) {
        // currentValue = this.hashPassword(value);
        const { salt, hash } = this.hashPassword(value);
        currentValue = hash;
        user.salt = salt;
      }
      user = {
        ...user,
        [key]: currentValue,
      };
    });

    const { password, salt, ...savedUser } = await this.userRepository.save(
      user,
    );
    return savedUser;
  }
}

export default UserService;
