import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { OrganizationsService } from 'src/modules/organizations/organizations.service';

@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(private organizationsService: OrganizationsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const organizationId = request.params.id;

    if (!organizationId) {
      return true; // Let other guards handle this
    }

    // Check if user is a member of the organization
    const userOrganizations =
      await this.organizationsService.getUserOrganizations(user.id);
    const isMember = userOrganizations.some(
      (membership) => membership.organization._id.toString() === organizationId,
    );

    if (!isMember) {
      throw new ForbiddenException('You are not a member of this organization');
    }

    // Add organization context to request
    request.organizationId = organizationId;
    return true;
  }
}
