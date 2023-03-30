import {
  BadGatewayException,
  CallHandler,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  catchError,
  map,
  Observable,
  of,
  tap,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';

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
    const id = params.userId;
    const { authorization } = headers;

    if (!authorization) {
      throw new HttpException(
        'please authorization in application',
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
    console.log(userId, id);
    if (id && Number(id) !== userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.userId = :userId', { userId })
      .leftJoinAndSelect('user.address', 'address')
      .leftJoinAndSelect('user.roles', 'roles')
      .addSelect('user.password')
      .getOne();

    request.user = user;

    return true;
  }
}

export interface Response<T> {
  data: T;
}

@Injectable()
export class WrapDataInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    // console.log(context);
    next.handle().pipe(map((data) => console.log('data pick', { data })));
    return next.handle().pipe(map((data) => ({ data })));
  }
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((value) => (value === null ? '' : value)));
  }
}

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        catchError((err) => throwError(() => new BadGatewayException(err))),
      );
  }
}

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isCached = true;
    if (isCached) {
      console.log('dick');
      return of({ ['sdsdfsdfsd']: 'dfdfd' });
    }
    return next.handle();
  }
}

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('timeout');
    return next.handle().pipe(
      timeout(5000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        console.log(next);
        return throwError(() => err);
      }),
    );
  }
}
