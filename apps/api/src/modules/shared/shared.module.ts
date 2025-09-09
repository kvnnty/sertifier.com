import { OrganizationGuard } from '@/common/guards/organization.guard';
import { Module } from '@nestjs/common';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [OrganizationsModule],
  providers: [OrganizationGuard],
  exports: [OrganizationGuard],
})
export class SharedModule {}
