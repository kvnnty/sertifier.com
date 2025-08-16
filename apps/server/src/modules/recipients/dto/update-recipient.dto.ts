import { PartialType } from '@nestjs/swagger';
import { CreateRecipientDto } from './create-recipient.dto';
import { IsArray, IsBoolean, IsOptional } from 'class-validator';

export class UpdateRecipientDto extends PartialType(CreateRecipientDto) {
  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
