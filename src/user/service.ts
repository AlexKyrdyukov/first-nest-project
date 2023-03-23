import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promisify } from 'util';

import * as crypto from 'crypto';
import { Repository } from 'typeorm';

import UserEntity from '../db/entities/User';
import config from '../config';
import UpdateUserPasswordDto from './dto/updateUserPassword.dto';
import CommentEntity from '../db/entities/Comment';
import PostEntity from '../db/entities/Post';
import AddressEntity from '../db/entities/Address';

type EnteredData = Record<string, string>;

type Data =
  | string
  | number
  | Date
  | CommentEntity[]
  | PostEntity[]
  | AddressEntity;

const pbkdf2Async = promisify(crypto.pbkdf2);
const randBytes = promisify(crypto.randomBytes);

@Injectable()
class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  // todo: rename
  confirmationStringType(value: Data | null): value is string {
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
        throw new HttpException(
          'user with this email already exist',
          HttpStatus.BAD_REQUEST,
        );
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

  async createSalt() {
    return randBytes(48)
      .then((value) => value.toString('hex'))
      .catch((error) => console.error(error));
  }

  async hashPass(password: string) {
    const salt = await this.createSalt();
    console.log(salt);
    return pbkdf2Async(
      password,
      String(salt),
      1000,
      64,
      config.hash.algorithm,
    ).then((value) => value.toString('hex'));
  }

  checkPassword(newPassword: string, oldPassword: string, salt: string) {
    const verification =
      crypto
        .pbkdf2Sync(newPassword, salt, 1000, 64, config.hash.algorithm)
        .toString('hex') === oldPassword;
    if (!verification) {
      throw new HttpException(
        'Entered password invalid',
        HttpStatus.BAD_REQUEST,
      );
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
      if (key === 'password' && this.confirmationStringType(value)) {
        const { salt, hash } = this.hashPassword(value);
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

      if (key === 'password' && this.confirmationStringType(value)) {
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
