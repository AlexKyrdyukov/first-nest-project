import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import RedisService from '../redis/service';
import config from '../config';

type Payload = Record<string, never>;

type ExpiresIn = keyof typeof config.token.expiresIn;

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
          reject(error); // delete return check work
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

  async createTokens(userId: number, deviceId: string) {
    // todo: Promise.all
    const arrayTypesTokens: ExpiresIn[] = ['access', 'refresh'];

    const [accessToken, refreshToken] = await Promise.all(
      arrayTypesTokens.map((item) =>
        this.asyncSign({ userId }, config.token.secret, {
          expiresIn: config.token.expiresIn[item],
        }),
      ),
    );

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

  async verifyToken(token: string): Promise<Payload> {
    return this.asyncVerify(token, config.token.secret, {
      complete: false,
    });
  }

  async verifyRefresh(deviceId: string, token: string) {
    const existenToken = await this.redisRepository.get(
      'refreshToken',
      deviceId,
    );
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
