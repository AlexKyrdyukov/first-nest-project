import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import UserEntity from '../db/entities/User';
import config from '../config';
import UpdateUserPasswordDto from './dto/updateUserPassword.dto';
import CommentEntity from '../db/entities/Comment';
import PostEntity from '../db/entities/Post';
import AddressEntity from '../db/entities/Address';
import CryptoService from '../crypto/service';

@Injectable()
class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private cryptoService: CryptoService,
  ) {}

  // todo: rename
  confirmationStringType(value: unknown): value is string {
    return (value as string)?.length !== undefined;
  }

  async hashPassword(password: string): Promise<{ hash: string }> {
    const hash = await this.cryptoService.hashString(
      password,
      config.hash.salt,
    );
    return {
      hash: String(hash),
    };
  }

  async checkPassword(newPassword: string, oldPassword: string, salt: string) {
    const verification =
      (await this.cryptoService.hashString(newPassword, salt)) === oldPassword;
    if (!verification) {
      throw new HttpException(
        'Entered password invalid',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

export default UserService;
