import { SetMetadata } from '@nestjs/common';
import { OrganizationPermissions } from 'src/modules/user-organization/enums/organization-permissions.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: OrganizationPermissions[]) =>
  SetMetadata(ROLES_KEY, roles);
