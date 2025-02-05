import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/users/schemas/users.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<UserRole>(
      'roles',
      context.getHandler(),
    );
    console.log('role: ', requiredRole);
    if (!requiredRole) return true;

    const request = context.switchToHttp().getRequest();
    console.log('request: ', request.user);
    // return request.user?.role.includes(requiredRole);
    if (!requiredRole.includes(request.user?.role)) {
      throw new ForbiddenException('Custom message');
    }
    return requiredRole.includes(request.user?.role);
  }
}
