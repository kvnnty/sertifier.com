import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OrganizationGuard } from '../../common/guards/organization.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { CreateOrganizationDto } from '../organizations/dto/create-organization.dto';
import { InviteMemberDto } from '../organizations/dto/invite-member.dto';
import { UpdateMemberPermissionsDto } from '../organizations/dto/update-member-permissions.dto';
import { UpdateOrganizationDto } from '../organizations/dto/update-organization.dto';
import { OrganizationsService } from '../organizations/organizations.service';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  // Organization Management
  @Post()
  create(@Body() createOrganizationDto: CreateOrganizationDto, @Request() req) {
    return this.organizationsService.create({
      ...createOrganizationDto,
      createdBy: req.user.id,
    });
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.organizationsService.findAll(+page, +limit);
  }

  @Get(':id')
  @UseGuards(OrganizationGuard)
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.organizationsService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(OrganizationGuard, PermissionGuard)
  @RequirePermissions('organization.update')
  update(
    @Param('id') id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(OrganizationGuard, PermissionGuard)
  @RequirePermissions('organization.delete')
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(id);
  }

  // Member Management
  @Post(':id/members/invite')
  @UseGuards(OrganizationGuard, PermissionGuard)
  @RequirePermissions('members.invite')
  inviteMember(
    @Param('id') organizationId: string,
    inviteMemberDto: InviteMemberDto,
    @Request() req,
  ) {
    return this.organizationsService.inviteMember(
      organizationId,
      inviteMemberDto,
      req.user.id,
    );
  }

  @Post(':id/members/accept')
  @UseGuards(OrganizationGuard)
  acceptInvitation(@Param('id') organizationId: string, @Request() req) {
    return this.organizationsService.acceptInvitation(
      req.user.id,
      organizationId,
    );
  }

  @Post(':id/members/:userId/decline')
  @UseGuards(OrganizationGuard)
  declineInvitation(
    @Param('id') organizationId: string,
    @Param('userId') userId: string,
  ) {
    // Implementation needed in service
    return { message: 'Invitation declined successfully' };
  }

  @Get(':id/members')
  @UseGuards(OrganizationGuard, PermissionGuard)
  @RequirePermissions('members.read')
  getMembers(
    @Param('id') organizationId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.organizationsService.getOrganizationMembers(
      organizationId,
      +page,
      +limit,
    );
  }

  @Get(':id/members/:userId')
  @UseGuards(OrganizationGuard, PermissionGuard)
  @RequirePermissions('members.read')
  getMember(
    @Param('id') organizationId: string,
    @Param('userId') userId: string,
  ) {
    // return this.organizationsService.getOrganizationMember(
    //   organizationId,
    //   userId,
    // );
  }

  @Patch(':id/members/:userId/permissions')
  @UseGuards(OrganizationGuard, PermissionGuard)
  @RequirePermissions('members.update')
  updateMemberPermissions(
    @Param('id') organizationId: string,
    @Param('userId') userId: string,
    updateMemberPermissionsDto: UpdateMemberPermissionsDto,
  ) {
    return this.organizationsService.updateMemberPermissions(
      organizationId,
      userId,
      updateMemberPermissionsDto,
    );
  }

  @Patch(':id/members/:userId/suspend')
  @UseGuards(OrganizationGuard, PermissionGuard)
  @RequirePermissions('members.suspend')
  suspendMember(
    @Param('id') organizationId: string,
    @Param('userId') userId: string,
  ) {
    // return this.organizationsService.suspendMember(organizationId, userId);
  }

  @Patch(':id/members/:userId/reactivate')
  @UseGuards(OrganizationGuard, PermissionGuard)
  @RequirePermissions('members.update')
  reactivateMember(
    @Param('id') organizationId: string,
    @Param('userId') userId: string,
  ) {
    // return this.organizationsService.reactivateMember(organizationId, userId);
  }

  @Delete(':id/members/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(OrganizationGuard, PermissionGuard)
  @RequirePermissions('members.remove')
  removeMember(
    @Param('id') organizationId: string,
    @Param('userId') userId: string,
  ) {
    return this.organizationsService.removeMember(organizationId, userId);
  }

  // Analytics and Statistics
  @Get(':id/stats')
  @UseGuards(OrganizationGuard, PermissionGuard)
  @RequirePermissions('organization.read')
  getStats(@Param('id') organizationId: string) {
    return this.organizationsService.getOrganizationStats(organizationId);
  }

  @Get(':id/activity')
  @UseGuards(OrganizationGuard, PermissionGuard)
  @RequirePermissions('organization.read')
  getActivity(
    @Param('id') organizationId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('type') type?: string,
  ) {
    // Implementation needed in service
    return { message: 'Activity log implementation needed' };
  }
}
