import { OrganizationsService } from '@/modules/organizations/organizations.service';
import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';


@Injectable()
export class OrganizationMiddleware implements NestMiddleware {
  constructor(private organizationsService: OrganizationsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const organizationId = req.headers['x-organization-id'] as string;
    const userId = req['user']?.id;

    if (!organizationId || !userId) {
      return next();
    }

    // Verify user has access to this organization
    const hasAccess = await this.organizationsService.userHasAccess(
      userId,
      organizationId,
    );

    if (!hasAccess) {
      throw new ForbiddenException('Access denied to this organization');
    }

    req['organization'] = { id: organizationId };
    next();
  }
}
