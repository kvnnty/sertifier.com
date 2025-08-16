import { IsArray, IsEnum, IsObject, IsOptional, IsString } from "class-validator";

export class CreateCampaignDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  templateId: string;

  @IsEnum(['manual', 'automated', 'bulk', 'api'])
  type: string;

  @IsOptional()
  @IsObject()
  emailConfig?: any;

  @IsOptional()
  @IsObject()
  automationRules?: any;

  @IsOptional()
  @IsArray()
  tags?: string[];
}
