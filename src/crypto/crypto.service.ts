import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import config from '../config';
import { promisify } from 'util';

const pbkdf2Async = promisify(crypto.pbkdf2);
const randBytes = promisify(crypto.randomBytes);

@Injectable()
class CryptoService {
  async createSalt(length: number) {
    return randBytes(length)
      .then((value) => value.toString('hex'))
      .catch((error) => console.error(error));
  }

  async hashString(stringData: string, salt: string) {
    return pbkdf2Async(stringData, salt, 1000, 64, config.hash.algorithm)
      .then((value) => value.toString('hex'))
      .catch((error) => console.error(error));
  }
}

export default CryptoService;
