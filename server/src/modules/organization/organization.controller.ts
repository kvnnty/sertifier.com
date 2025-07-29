import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateOrganizationDto } from './dto/organization.dto';
import { UserPermissions } from './enums/user-permissions.enum';
import { OrganizationService } from './organization.service';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req,
    @Body() createOrganizationDto: CreateOrganizationDto,
  ) {
    return this.organizationService.createNewOrganization(
      req.user,
      createOrganizationDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/invite')
  async invite(
    @Request() req,
    @Param('id') organizationId: string,
    @Body('email') email: string,
    @Body('permissions') permissions: UserPermissions[],
  ) {
    return this.organizationService.inviteUserToOrganization(
      req.user,
      organizationId,
      email,
      permissions,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join/:invitationId')
  async join(
    @Request() req,
    @Param('id') organizationId: string,
    @Param('invitationId') invitationId: string,
  ) {
    return this.organizationService.addUserToOrganization(
      req.user,
      organizationId,
      invitationId,
    );
  }
}
