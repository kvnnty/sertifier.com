import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { CreateOrganizationDto } from './dto/create-organization.dto';
import type { InviteMemberDto } from './dto/invite-member.dto';
import type { UpdateMemberPermissionsDto } from './dto/update-member-permissions.dto';
import type { UpdateOrganizationDto } from './dto/update-organization.dto';
import {
  OrganizationMember,
  OrganizationMemberDocument,
} from './schema/organization-member.schema';
import {
  Organization,
  OrganizationDocument,
} from './schema/organization.schema';

export interface OrganizationMembership {
  organization: OrganizationDocument;
  permissions: string[];
  status: string;
  joinedAt: Date;
  metadata?: any;
}

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    @InjectModel(OrganizationMember.name)
    private organizationMemberModel: Model<OrganizationMemberDocument>,
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    let slug: string;
    let exists: boolean;

    do {
      slug = this.generateSlug(createOrganizationDto.name);
      exists = !!(await this.organizationModel.findOne({ slug }));
    } while (exists);

    const organization = await new this.organizationModel({
      ...createOrganizationDto,
      slug: this.generateSlug(createOrganizationDto.name),
    }).save();

    await this.addAdminMember(organization.id, createOrganizationDto.createdBy);
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ organizations: OrganizationDocument[]; total: number }> {
    const skip = (page - 1) * limit;

    const [organizations, total] = await Promise.all([
      this.organizationModel
        .find({ isActive: true })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.organizationModel.countDocuments({ isActive: true }),
    ]);

    return { organizations, total };
  }

  async findOne(id: string): Promise<OrganizationDocument> {
    const organization = await this.organizationModel
      .findById(id)
      .populate('createdBy', 'firstName lastName email');

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async findBySlug(slug: string): Promise<OrganizationDocument> {
    const organization = await this.organizationModel
      .findOne({ slug, isActive: true })
      .populate('createdBy', 'firstName lastName email');

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<OrganizationDocument> {
    if (updateOrganizationDto.name) {
      updateOrganizationDto.slug = this.generateSlug(
        updateOrganizationDto.name,
      );
    }

    const organization = await this.organizationModel.findByIdAndUpdate(
      id,
      updateOrganizationDto,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async remove(id: string): Promise<void> {
    const result = await this.organizationModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!result) {
      throw new NotFoundException('Organization not found');
    }

    // Also deactivate all memberships
    await this.organizationMemberModel.updateMany(
      { organizationId: id },
      { status: 'suspended' },
    );
  }

  // Member Management - Simplified without roles
  async inviteMember(
    organizationId: string,
    inviteMemberDto: InviteMemberDto,
    invitedBy: string,
  ): Promise<OrganizationMemberDocument> {
    // Check if user is already a member
    const existingMember = await this.organizationMemberModel.findOne({
      userId: inviteMemberDto.userId,
      organizationId,
    });

    if (existingMember) {
      throw new ConflictException(
        'User is already a member of this organization',
      );
    }

    const member = new this.organizationMemberModel({
      userId: inviteMemberDto.userId,
      organizationId,
      permissions: inviteMemberDto.permissions,
      status: 'pending',
      invitedBy,
      invitedAt: new Date(),
      metadata: inviteMemberDto.metadata,
    });

    return member.save();
  }

  async acceptInvitation(userId: string, organizationId: string): Promise<any> {
    const member = await this.organizationMemberModel.findOneAndUpdate(
      { userId, organizationId, status: 'pending' },
      { status: 'active', joinedAt: new Date() },
      { new: true },
    );

    if (!member) {
      throw new NotFoundException('Invitation not found or already processed');
    }

    return member;
  }

  async getOrganizationMembers(
    organizationId: string,
    page = 1,
    limit = 10,
  ): Promise<{ members: any[]; total: number }> {
    const skip = (page - 1) * limit;

    const [members, total] = await Promise.all([
      this.organizationMemberModel
        .find({ organizationId, status: { $ne: 'left' } })
        .populate('userId', 'firstName lastName email profileImage lastLoginAt')
        .populate('invitedBy', 'firstName lastName email')
        .skip(skip)
        .limit(limit)
        .sort({ joinedAt: -1 })
        .exec(),
      this.organizationMemberModel.countDocuments({
        organizationId,
        status: { $ne: 'left' },
      }),
    ]);

    return { members, total };
  }

  async updateMemberPermissions(
    organizationId: string,
    userId: string,
    updateMemberPermissionsDto: UpdateMemberPermissionsDto,
  ): Promise<any> {
    const member = await this.organizationMemberModel.findOneAndUpdate(
      { userId, organizationId },
      {
        permissions: updateMemberPermissionsDto.permissions,
        metadata: updateMemberPermissionsDto.metadata,
      },
      { new: true },
    );

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return member;
  }

  async removeMember(organizationId: string, userId: string): Promise<void> {
    const result = await this.organizationMemberModel.findOneAndUpdate(
      { userId, organizationId },
      { status: 'left', leftAt: new Date() },
      { new: true },
    );

    if (!result) {
      throw new NotFoundException('Member not found');
    }
  }

  // Permission Management
  async getUserPermissions(
    userId: string,
    organizationId: string,
  ): Promise<string[]> {
    const member = await this.organizationMemberModel.findOne({
      userId,
      organizationId,
      status: 'active',
    });

    if (!member) {
      return [];
    }

    return member.permissions || [];
  }

  async hasPermission(
    userId: string,
    organizationId: string,
    permission: string,
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId, organizationId);
    return permissions.includes(permission) || permissions.includes('*');
  }

  async getUserOrganizations(userId: string) {
    const memberships = await this.organizationMemberModel
      .find({ userId, status: 'active' })
      .populate('organizationId')
      .sort({ joinedAt: -1 });

    const organizations = memberships.map((m) => m.organizationId);

    return organizations;
  }

  // Utility Methods
  private generateSlug(name: string): string {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const randomDigits = Math.floor(1000 + Math.random() * 9000);

    return `${baseSlug}-${randomDigits}`;
  }

  // Analytics and Statistics
  async getOrganizationStats(organizationId: string): Promise<any> {
    const [totalMembers, activeMembers, pendingInvitations] = await Promise.all(
      [
        this.organizationMemberModel.countDocuments({ organizationId }),
        this.organizationMemberModel.countDocuments({
          organizationId,
          status: 'active',
        }),
        this.organizationMemberModel.countDocuments({
          organizationId,
          status: 'pending',
        }),
      ],
    );

    return {
      members: {
        total: totalMembers,
        active: activeMembers,
        pending: pendingInvitations,
      },
    };
  }

  // Helper method to create admin member (for organization creator)
  async addAdminMember(organizationId: string, userId: string): Promise<any> {
    const adminPermissions = [
      '*', // Wildcard permission for full access
    ];

    const member = new this.organizationMemberModel({
      userId,
      organizationId,
      permissions: adminPermissions,
      status: 'active',
      joinedAt: new Date(),
      metadata: {
        displayRole: 'Owner',
        notes: 'Organization creator',
      },
    });

    return member.save();
  }
}
