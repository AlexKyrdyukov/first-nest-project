import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import RedisService from '../redis/service';
import config from '../config';

type PayloadType = Record<string, never>;
@Injectable()
class TokenService {
  constructor(private redisRepository: RedisService<string>) {}
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
    return new Promise<P>((resolve, reject) => {
      jwt.verify(token, secret, options, (error, data) => {
        if (error) {
          if (error.message === 'jwt expired') {
            throw new HttpException(
              'User unauthorized',
              HttpStatus.UNAUTHORIZED,
            ); //user unaunthorized(toke expired)
          }
          return reject(
            new HttpException(
              'User unknown type authorized',
              HttpStatus.UNAUTHORIZED,
            ), //user unaunthorized (unknown type authorization)
          );
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

    await this.redisRepository.set(
      'refreshToken',
      deviceId,
      refreshToken,
      config.token.expiresIn.refresh,
    );

    return {
      accessToken,
      refreshToken,
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

  async verifyRefresh(deviceId: string, token: string) {
    const existenToken = await this.redisRepository.get(
      'refreshToken',
      deviceId,
    );
    if (token !== existenToken || !existenToken) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN); //user dont login please login
    }
    const payload = await this.verifyToken(token);
    return payload;
  }
}

export default TokenService;
