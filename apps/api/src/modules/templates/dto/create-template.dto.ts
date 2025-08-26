import { IsString, IsEnum, IsOptional, IsObject, IsArray } from 'class-validator';
import { TemplateStatus, TemplateType } from '../schema/template.schema';

export class CreateTemplateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TemplateType)
  type: TemplateType;

  @IsOptional()
  @IsObject()
  design?: any;

  @IsOptional()
  @IsArray()
  fields?: any[];

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsEnum(TemplateStatus)
  status?: TemplateStatus;
}