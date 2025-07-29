import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InviteMemberDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: ['credentials.create', 'credentials.read', 'templates.read'],
    description: 'Array of permissions to assign to the user',
  })
  @IsArray()
  @IsString({ each: true })
  permissions: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  metadata?: {
    department?: string;
    jobTitle?: string;
    notes?: string;
    displayRole?: string; // Optional: "Manager", "Admin", etc. for UI
  };
}
