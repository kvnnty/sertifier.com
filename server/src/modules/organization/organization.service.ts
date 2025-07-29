import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './dto/organization.dto';
import {
  Organization,
  OrganizationDocument,
} from './schema/organization.schema';
import { Invitation, InvitationDocument } from './schema/invitation.schema';
import { UserPermissions } from './enums/user-permissions.enum';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private readonly organizationModel: Model<OrganizationDocument>,
    @InjectModel(Invitation.name)
    private readonly invitationModel: Model<InvitationDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createNewOrganization(
    user: User,
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    const organization = new this.organizationModel({
      ...createOrganizationDto,
      members: [
        {
          user: new Types.ObjectId(user._id),
          permissions: Object.values(UserPermissions),
        },
      ],
    });

    const savedOrganization = await organization.save();

    // Update user's organizationIds
    await this.userModel
      .findByIdAndUpdate(user._id, {
        $addToSet: { organizationIds: organization._id },
      })
      .exec();

    return savedOrganization;
  }

  async inviteUserToOrganization(
    invitingUser: User,
    organizationId: string,
    inviteeEmail: string,
    permissions: UserPermissions[],
  ): Promise<Invitation> {
    const organization = await this.organizationModel
      .findById(organizationId)
      .exec();
    if (!organization) {
      throw new NotFoundException(
        `Organization with ID ${organizationId} not found`,
      );
    }

    const invitingMember = organization.members.find(
      (member) => member.user.toString() === invitingUser._id.toString(),
    );
    if (
      !invitingMember ||
      !invitingMember.permissions.includes(UserPermissions.MANAGE_MEMBERS)
    ) {
      throw new BadRequestException(
        'User does not have permission to invite members',
      );
    }

    const isAlreadyMember = organization.members.some(
      (member) => member.user.toString() === invitingUser._id.toString(),
    );
    if (isAlreadyMember) {
      throw new BadRequestException(
        'User is already a member of this organization',
      );
    }

    const existingInvitation = await this.invitationModel
      .findOne({
        organization: organizationId,
        email: inviteeEmail,
        status: 'pending',
      })
      .exec();
    if (existingInvitation) {
      throw new BadRequestException(
        'An invitation is already pending for this email',
      );
    }

    const invitation = new this.invitationModel({
      organization: new Types.ObjectId(organizationId),
      email: inviteeEmail,
      permissions,
      invitedBy: new Types.ObjectId(invitingUser._id),
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return await invitation.save();
  }

  async addUserToOrganization(
    user: User,
    organizationId: string,
    invitationId: string,
  ): Promise<Organization> {
    const invitation = await this.invitationModel
      .findOne({
        _id: invitationId,
        email: user.email,
        status: 'pending',
      })
      .exec();

    if (!invitation) {
      throw new NotFoundException('Valid invitation not found');
    }

    if (invitation.expiresAt < new Date()) {
      throw new BadRequestException('Invitation has expired');
    }

    const organization = await this.organizationModel
      .findById(organizationId)
      .exec();
    if (!organization) {
      throw new NotFoundException(
        `Organization with ID ${organizationId} not found`,
      );
    }

    const isAlreadyMember = organization.members.some(
      (member) => member.user.toString() === user._id.toString(),
    );
    if (isAlreadyMember) {
      throw new BadRequestException(
        'User is already a member of this organization',
      );
    }

    // Add user to organization members
    organization.members.push({
      user: new Types.ObjectId(user._id),
      permissions: invitation.permissions,
    });

    // Update user's organizationIds
    await this.userModel
      .findByIdAndUpdate(user._id, {
        $addToSet: { organizationIds: organization._id },
      })
      .exec();

    // Update invitation status
    invitation.status = 'accepted';
    invitation.acceptedAt = new Date();

    await Promise.all([organization.save(), invitation.save()]);

    return organization;
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationModel.find().exec();
  }

  async findOne(id: string): Promise<Organization> {
    const organization = await this.organizationModel.findById(id).exec();
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    return organization;
  }

  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    const organization = await this.organizationModel
      .findByIdAndUpdate(id, { $set: updateOrganizationDto }, { new: true })
      .exec();
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    return organization;
  }

  async remove(id: string): Promise<void> {
    const result = await this.organizationModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    // Optionally, update users' organizationIds to remove this organization
    await this.userModel
      .updateMany({ organizationIds: id }, { $pull: { organizationIds: id } })
      .exec();
  }
}
