import { IsArray, IsEmail, IsEnum, IsString } from 'class-validator';
import { OrganizationPermissions } from '../enums/organization-permissions.enum';

export class InviteUserDto {
  @IsEmail()
  email: string;

  @IsArray()
  permissions: OrganizationPermissions[];

  @IsString()
  organizationId: string;
}
