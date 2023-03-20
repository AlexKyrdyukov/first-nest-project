import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import User from '../db/entities/User';
import TokenService from '../token/service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { headers, params } = request;
    const { authorization } = headers;
    if (!authorization) {
      return false;
    }
    const [auth, token] = authorization.split(' ');
    if (auth !== 'Bearer') {
      return false;
    }
    const { userId } = await this.tokenService.verifyToken(token);

    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.userId = :userId', { userId })
      .addSelect('user.password')
      .getOne();

    request.user = user;

    return true;
  }
}
