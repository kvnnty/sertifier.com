import { SetMetadata } from '@nestjs/common';
import { UserPermissions } from 'src/modules/organization/enums/user-permissions.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserPermissions[]) =>
  SetMetadata(ROLES_KEY, roles);
