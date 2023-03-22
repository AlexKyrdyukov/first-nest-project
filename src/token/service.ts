import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import RedisService from '../redis/service';
import config from '../config';
// import { promisify } from 'util';

// const jwtSignPromised = promisify(jwt.sign);

type PayloadType = Record<string, never>;
@Injectable()
class TokenService {
  constructor(private redisRepository: RedisService<string>) {}

  async asyncSign<P extends object>(
    payload: P,
    secret: string,
    options: jwt.SignOptions,
  ) {
    // return jwtSignPromised(payload, secret, options);
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
            reject(
              new HttpException('User unauthorized', HttpStatus.UNAUTHORIZED),
            ); //user unaunthorized(toke expired)
          }
          reject(
            new HttpException(
              'User unknown type authorized please sign in application',
              HttpStatus.UNAUTHORIZED,
            ), //user unaunthorized (unknown type salt | hash)
          );
        }
        resolve(data as P);
      });
    });
  }

  async createTokens(userId: string, deviceId: string) {
    // todo: Promise.all
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

  async verifyToken(token: string): Promise<PayloadType> {
    return this.asyncVerify(token, config.token.secret, {
      complete: false,
    });
  }

  async verifyRefresh(deviceId: string, token: string) {
    const existenToken = await this.redisRepository.get(
      'refreshToken',
      deviceId,
    );
    console.log(deviceId, 'token front:', token, 'tokenredis:', existenToken);
    if (token !== existenToken || !existenToken) {
      throw new HttpException(
        'Please sign in application and repeat request',
        HttpStatus.FORBIDDEN,
      ); //user dont login please login
    }
    const payload = await this.verifyToken(token);
    return payload;
  }
}

export default TokenService;
