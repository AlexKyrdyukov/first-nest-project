import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import UserEntity from '../db/entities/User';
import TokenService from '../token/service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { headers, params } = request;
    const { authorization } = headers;
    if (!authorization) {
      throw new HttpException(
        'Please authorization in application',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const [auth, token] = authorization.split(' ');
    if (auth !== 'Bearer') {
      throw new HttpException(
        'Unknown type authorization, please enter in application & repeat request',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const { userId } = await this.tokenService.verifyToken(token);

    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.userId = :userId', { userId })
      .leftJoinAndSelect('user.address', 'address')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.comment', 'comment')
      .leftJoinAndSelect('user.posts', 'posts')
      .addSelect('user.password')
      .getOne();

    request.user = user;

    return true;
  }
}
