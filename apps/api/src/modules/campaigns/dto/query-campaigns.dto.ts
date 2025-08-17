import { IsOptional, IsString } from "class-validator";

export class QueryCampaignsDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  limit?: number;

  @IsOptional()
  @IsString()
  page?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: string;
}
