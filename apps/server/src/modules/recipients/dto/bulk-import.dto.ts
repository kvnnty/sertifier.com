import { IsArray, IsBoolean, IsOptional } from "class-validator";

export class BulkImportDto {
  @IsOptional()
  @IsBoolean()
  skipDuplicates?: boolean = true;

  @IsOptional()
  @IsBoolean()
  updateExisting?: boolean = false;

  @IsOptional()
  @IsArray()
  customFieldMapping?: Record<string, string>;
}
