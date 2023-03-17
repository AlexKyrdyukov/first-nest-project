import * as jwt from 'jsonwebtoken';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import config from '../config';
import RedisService from '../redis/service';
type PayloadType = Record<string, never>;

@Injectable()
class TokenService {
  constructor(
    @Inject('REDIS_SERVICE')
    private redisRepository: RedisService<string>,
  ) {}
  async asyncSign<P extends object>(
    payload: P,
    secret: string,
    options: jwt.SignOptions,
  ) {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(payload, secret, options, (error, data) => {
        if (error) {
          return reject(error);
        }
        resolve(data as string);
      });
    });
  }

  async asyncVerify<P extends object>(
    token: string,
    secret: string,
    options: jwt.VerifyOptions,
  ) {
    return new Promise<P>((resolve) => {
      jwt.verify(token, secret, options, (error, data) => {
        if (error) {
          if (error.message === 'jwt expired') {
            throw new BadRequestException('Error', {
              cause: new Error(),
              description: 'Entered password invalid',
            });
          }
          throw new BadRequestException('Error', {
            cause: new Error(),
            description: 'Entered password invalid',
          });
        }
        return resolve(data as P);
      });
    });
  }

  async createTokens(userId: string, deviceId: string) {
    const accessToken = await this.asyncSign({ userId }, config.token.secret, {
      expiresIn: config.token.expiresIn.access,
    });

    const refreshToken = await this.asyncSign({ userId }, config.token.secret, {
      expiresIn: config.token.expiresIn.refresh,
    });
    console.log(60);
    console.log(this.redisRepository);
    await this.redisRepository.set(
      'refreshToken',
      deviceId,
      refreshToken,
      config.token.expiresIn.refresh,
    );
    console.log(66);

    const a = await this.redisRepository.get('refreshToken', deviceId);
    console.log(a);
    return {
      accessToken,
      refreshToken,
      a,
    };
  }

  async verifyToken(token: string) {
    const payload: PayloadType = await this.asyncVerify(
      token,
      config.token.secret,
      { complete: false },
    );
    return payload;
  }
}

export default TokenService;
