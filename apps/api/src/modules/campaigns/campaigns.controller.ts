import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { OrganizationGuard } from '@/common/guards/organization.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CampaignsService } from './campaigns.service';
import { BulkIssueDto, CreateCampaignDto, QueryCampaignsDto } from './dto';

@Controller('campaigns')
@UseGuards(JwtAuthGuard, OrganizationGuard)
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  create(@Body() createCampaignDto: CreateCampaignDto, @Req() req: Request) {
    return this.campaignsService.create(
      createCampaignDto,
      req.user.id,
      req.organizationId,
    );
  }

  @Get()
  findAll(@Query() query: QueryCampaignsDto, @Req() req: Request) {
    return this.campaignsService.findAll(req.organizationId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.campaignsService.findOne(id, req.organizationId);
  }

  @Get(':id/analytics')
  getAnalytics(@Param('id') id: string, @Req() req: Request) {
    return this.campaignsService.getAnalytics(id, req.organizationId);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCampaignDto: UpdateCampaignDto,
  //   @Req() req: Request,
  // ) {
  //   return this.campaignsService.update(
  //     id,
  //     updateCampaignDto,
  //     req.organizationId,
  //   );
  // }

  @Post(':id/start')
  start(@Param('id') id: string, @Req() req: Request) {
    return this.campaignsService.start(id, req.organizationId);
  }

  // @Post(':id/pause')
  // pause(@Param('id') id: string, @Req() req: Request) {
  //   return this.campaignsService.pause(id, req.organizationId);
  // }

  @Post(':id/bulk-issue')
  bulkIssue(
    @Param('id') id: string,
    @Body() bulkIssueDto: BulkIssueDto,
    @Req() req: Request,
  ) {
    return this.campaignsService.bulkIssue(
      id,
      bulkIssueDto.recipients,
      req.organizationId,
    );
  }

  // @Delete(':id')
  // remove(@Param('id') id: string, @Req() req: Request) {
  //   return this.campaignsService.remove(id, req.organizationId);
  // }
}
