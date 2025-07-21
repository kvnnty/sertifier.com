import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { Organization } from '../organization/organization.entity';
import { OrganizationPermissions } from './enums/organization-permissions.enum';
import { UserOrganization } from './user-organization.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectId } from 'typeorm';

@Injectable()
export class UserOrganizationService {
  constructor(
    @InjectRepository(UserOrganization)
    private readonly userOrganizationRepository: Repository<UserOrganization>,
  ) {}

  async addUserToOrganization(
    user: User,
    organization: Organization,
    permissions: OrganizationPermissions[],
  ): Promise<UserOrganization> {
    const userOrg = this.userOrganizationRepository.create({
      userId: user.id as ObjectId,
      organizationId: organization.id as ObjectId,
      permissions,
    });
    return this.userOrganizationRepository.save(userOrg);
  }
}
