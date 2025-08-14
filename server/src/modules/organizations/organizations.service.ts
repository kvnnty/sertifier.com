import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';
import type { CreateOrganizationDto } from './dto/create-organization.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
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
    private mailService: MailService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
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

  async findById(id: string) {
    const organization = await this.organizationModel
      .findById(id)
      .populate('createdBy', 'firstName lastName email profileImage');

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async findBySlug(slug: string) {
    const organization = await this.organizationModel
      .findOne({ slug, isActive: true })
      .populate('createdBy', 'firstName lastName email profileImage');

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async update(id: string, dto: UpdateOrganizationDto) {
    if (dto.name) {
      dto.slug = this.generateSlug(dto.name);
    }

    const organization = await this.organizationModel.findByIdAndUpdate(
      id,
      dto,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return { message: 'Organization updated', organization };
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

  // Generates an invite token and sends email
  async inviteMember(
    organizationId: string,
    dto: InviteMemberDto,
    invitedBy: string,
  ) {
    const organization = await this.findById(organizationId);
    if (!organization) throw new NotFoundException('Organization not found');

    let user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      user = await this.usersService.createNewUser({
        email: dto.email,
        firstName: '',
        lastName: '',
        password: null,
        isVerified: false,
      });
    }

    const existing = await this.organizationMemberModel.findOne({
      userId: user.id,
      organizationId,
    });
    if (existing) {
      if (existing.status === 'pending')
        throw new ConflictException('User already invited');
      throw new ConflictException('User is already a member');
    }

    const member = new this.organizationMemberModel({
      userId: user.id,
      organizationId,
      permissions: dto.permissions,
      invitedBy,
      invitedAt: new Date(),
      status: 'pending',
      metadata: dto.metadata,
    });
    await member.save();

    // Create JWT token for the invite
    const token = await this.jwtService.signAsync(
      { userId: user._id, organizationId, invitedAt: member.invitedAt },
      {
        secret: this.configService.get<string>(
          'ORGANIZATION_INVITATION_TOKEN_SECRET',
        ),
        expiresIn:
          this.configService.get<string>(
            'ORGANIZATION_INVITATION_TOKEN_EXPIRES_IN',
          ) || '7d',
      },
    );

    const inviteLink = `${this.configService.get<string>('FRONTEND_URL')}/orgs/accept-invite?new-user=${!user.isVerified}&token=${token}`;

    await this.mailService.sendTemplateEmail(
      dto.email,
      `You were invited to join ${organization.name} on Sertifier`,
      'organization-invitation',
      {
        organizationName: organization.name,
        memberName:
          user.firstName || user.lastName
            ? `${user.firstName} ${user.lastName}`.trim()
            : dto.email,
        inviterName: `${(organization.createdBy as any).firstName} ${(organization.createdBy as any).lastName}`,
        permissions: dto.permissions,
        inviteLink,
      },
    );

    return { message: 'Invitation sent' };
  }

  async acceptInvite(token: string) {
    let payload;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>(
          'ORGANIZATION_INVITATION_TOKEN_SECRET',
        ),
      });
    } catch {
      throw new BadRequestException(
        'Your invitation link is invalid or expired',
      );
    }

    const { userId, organizationId } = payload;

    const membership = await this.organizationMemberModel.findOne({
      userId,
      organizationId,
      status: 'pending',
    });

    if (!membership) throw new NotFoundException('No pending invite found');

    // Mark as active
    membership.status = 'active';
    membership.joinedAt = new Date();
    await membership.save();

    const user = await this.usersService.findById(userId);
    if (user && !user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    return { message: 'Invitation accepted successfully' };
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
        .populate('userId', 'firstName lastName email profileImage isVerified')
        .populate('invitedBy', 'firstName lastName email profileImage')
        .skip(skip)
        .limit(limit)
        .sort({ joinedAt: -1 })
        .exec(),
      this.organizationMemberModel.countDocuments({
        organizationId,
        status: { $ne: 'left' },
      }),
    ]);

    const structuredMembersObj = members.map((member) => {
      const { userId, ...rest } = member.toObject();
      return {
        ...rest,
        user: userId,
      };
    });

    return { members: structuredMembersObj, total };
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

  // Utility Methods
  private generateSlug(name: string): string {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const randomDigits = Math.floor(1000 + Math.random() * 9000);

    return `${baseSlug}-${randomDigits}`;
  }

  // Helper method to create admin member (for organization creator)
  private async addAdminMember(
    organizationId: string,
    userId: string,
  ): Promise<any> {
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
