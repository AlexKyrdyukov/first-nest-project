import UserEntity from '../db/entities/User';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const routeRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    const request: { user: UserEntity } = context.switchToHttp().getRequest();
    const { roles } = request.user;
    const isAdmin = routeRoles.findIndex(
      (item, index) => item === roles[0].name,
    );
    console.log(isAdmin);
    if (isAdmin !== -1) {
      return true;
    }
    return true;
  }
}
