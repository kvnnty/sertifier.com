import { OrganizationsService } from '@/modules/organizations/organizations.service';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(private readonly organizationService: OrganizationsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const currentOrganizationId = request.headers[
      'x-organization-id'
    ] as string;
    if (!currentOrganizationId)
      throw new ForbiddenException('Current organization header is required');

    const hasAccess = await this.organizationService.userHasAccess(
      request.user.id,
      currentOrganizationId,
    );

    if (!hasAccess) {
      throw new ForbiddenException(
        "You don't have access to this organization",
      );
    }
    request.organizationId = currentOrganizationId;
    return true;
  }
}
