import {
  IsArray,
  IsEmail,
  IsObject,
  IsOptional,
  IsString
} from 'class-validator';

export class CreateRecipientDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsObject()
  customFields?: Record<string, string>;

  @IsOptional()
  @IsArray()
  tags?: string[];
}
