import {
  Injectable,
  Inject,
  HttpException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import CryptoJS from 'crypto-js';
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

  checkIsString(value: string | number | Date): value is string {
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
      return await this.createNewUser(body);
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(params: EnteredData): Promise<User | null> {
    const { userId } = params;
    return await this.userRepository.findOne({
      where: {
        userId: Number(userId),
      },
    });
  }

  async findByEmail(params: EnteredData): Promise<User | null> {
    const { email } = params;
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async delete(param: EnteredData) {
    const user = await this.findById(param);
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

  async update(body: Partial<User>) {
    const { userId } = body;
    const updateUser = await this.findById({ userId: String(userId) });
    if (!updateUser) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    let newUser: Record<string, string | number | Date> = {};

    Object.entries(body).forEach(([key, value]) => {
      let newValue = value;
      if (key === 'password' && this.checkIsString(value)) {
        newValue = this.hashPassword(value);
      }
      newUser = {
        ...updateUser,
        [key]: newValue,
      };
    });

    const { password, ...savedUser } = await this.userRepository.save(newUser);
    return savedUser;
  }

  async createNewUser(params: Partial<User>) {
    let user: Partial<User> = new User();

    Object.entries(params).forEach(([key, value]) => {
      let currentValue = value;

      if (key === 'password' && this.checkIsString(value)) {
        currentValue = this.hashPassword(value);
      }
      user = {
        ...user,
        [key]: currentValue,
      };
    });

    const { password, ...savedUser } = await this.userRepository.save(user);
    return savedUser;
  }
}
