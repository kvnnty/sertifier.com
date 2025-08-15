import { IsArray, IsOptional } from "class-validator";

export class QueryRecipientsDto {
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 20;

  @IsOptional()
  search?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  company?: string;

  @IsOptional()
  startDate?: string;

  @IsOptional()
  endDate?: string;

  @IsOptional()
  sortBy?: string = 'createdAt';

  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
