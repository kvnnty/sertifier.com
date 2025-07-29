import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { Invitation, InvitationSchema } from './schema/invitation.schema';
import { OrganizationMember, OrganizationMemberSchema } from './schema/organization-member.schema';
import { Organization, OrganizationSchema } from './schema/organization.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
      { name: OrganizationMember.name, schema: OrganizationMemberSchema },
      { name: Invitation.name, schema: InvitationSchema },
    ]),
  ],
  providers: [OrganizationsService],
  controllers: [OrganizationsController],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
