import { OrganizationsService } from '@/modules/organizations/organizations.service';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private organizationsService: OrganizationsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const organizationId = request.organizationId || request.params.id;

    if (!organizationId) {
      throw new ForbiddenException('Organization context required');
    }

    // Check if user has required permissions
    for (const permission of requiredPermissions) {
      const hasPermission = await this.organizationsService.hasPermission(
        user.id,
        organizationId,
        permission,
      );

      if (!hasPermission) {
        throw new ForbiddenException(
          `Missing required permission: ${permission}`,
        );
      }
    }

    return true;
  }
}
