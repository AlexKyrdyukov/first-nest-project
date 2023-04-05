import UserEntity from '../db/entities/User';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const routeRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    const {
      roles: [{ name }],
    } = request.user as UserEntity;
    // const info = routeRoles.map((item, index) => route);
    const isAdmin = routeRoles.findIndex((item, index) => item === name);
    if (isAdmin !== -1) {
      return true;
    }
    // console.log(request.user);
    // const isUser = roles.map((item) =>
    //   routeRoles.includes(item.name as string),
    // );
    return true;
  }
}
