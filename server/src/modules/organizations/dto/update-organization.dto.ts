import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsObject, IsString, IsIn } from 'class-validator';
import { CreateOrganizationDto } from './create-organization.dto';

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsIn(['trial', 'basic', 'premium', 'enterprise'])
  subscriptionPlan?: string;

  @IsOptional()
  @IsObject()
  subscriptionLimits?: {
    maxCredentials: number;
    maxTemplates: number;
    maxMembers: number;
    maxStorageGB: number;
  };

  @IsOptional()
  @IsObject()
  brandingSettings?: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    logoPosition: string;
    customCSS?: string;
  };
}
