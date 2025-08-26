import { IsArray } from 'class-validator';

export class BulkIssueDto {
  @IsArray()
  recipients: any[];
}
