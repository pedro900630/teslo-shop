import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get<string[] | undefined>(
      META_ROLES,
      ctx.getHandler(),
    );

    if (!validRoles) {
      return true;
    }

    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new BadRequestException('User not found (request)');
    }

    if (!validRoles.some((role) => user.roles.includes(role))) {
      throw new ForbiddenException(
        `User ${user.fullName} need a valid role: [${validRoles}]`,
      );
    }

    return true;
  }
}
