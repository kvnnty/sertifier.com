import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId, Repository } from 'typeorm';
import { OrganizationPermissions } from '../user-organization/enums/organization-permissions.enum';
import { UserOrganizationService } from '../user-organization/user-organization.service';
import { User } from '../user/user.entity';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './dto/organization.dto';
import { Organization } from './organization.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    private userOrganizationService: UserOrganizationService,
  ) {}

  async createNewOrganization(
    user: User,
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    const organization = this.organizationRepository.create(
      createOrganizationDto,
    );

    const savedOrganization =
      await this.organizationRepository.save(organization);

    await this.userOrganizationService.addUserToOrganization(
      user,
      savedOrganization,
      Object.values(OrganizationPermissions), // user has all permissions
    );

    return savedOrganization;
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationRepository.find();
  }

  async findOne(id: string): Promise<Organization> {
    const organization = await this.organizationRepository.findOneBy({
      id: new ObjectId(id),
    });
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    return organization;
  }

  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    const organization = await this.findOne(id); // Reuse findOne to check existence
    Object.assign(organization, updateOrganizationDto);
    return this.organizationRepository.save(organization);
  }

  async remove(id: string): Promise<void> {
    const result = await this.organizationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
  }
}
