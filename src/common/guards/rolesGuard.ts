import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles';
import { UserRole } from 'src/modules/user/enum/enum.user';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the roles specified in the @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are specified, allow access by default
    if (!requiredRoles) {
      return true;
    }

    // Get the user from the request (authenticated by your UserGuard)
    const { user } = context.switchToHttp().getRequest();

    // If the user's role is included in the required roles, grant access
    if (requiredRoles.includes(user.role)) {
      return true;
    } else {
      throw new ForbiddenException('You do not have permission to access this resource');
    }
  }
}
