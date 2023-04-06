import UserEntity from '../db/entities/User';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    try {
      const routeRoles = this.reflector.get<string[]>(
        'roles',
        context.getHandler(),
      );
      if (!routeRoles) {
        return true;
      }
      const request: { user: UserEntity } = context.switchToHttp().getRequest();
      const { roles } = request.user;
      return roles.some((role) => routeRoles.includes(role.name));
    } catch (error) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
