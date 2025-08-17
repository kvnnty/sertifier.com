import { OrganizationDocument } from '@/modules/organizations/schema/organization.schema';
import { UserDocument } from '@/modules/users/schemas/user.schema';

declare module 'express' {
  interface Request {
    user: UserDocument;
    organization: OrganizationDocument;
  }
}
