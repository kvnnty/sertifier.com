import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import {
  CreateCampaignDto,
  UpdateCampaignDto,
  QueryCampaignsDto,
  BulkIssueDto,
} from './dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { OrganizationGuard } from '@/common/guards/organization.guard';

@Controller('campaigns')
@UseGuards(JwtAuthGuard, OrganizationGuard)
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  create(@Body() createCampaignDto: CreateCampaignDto, @Req() req: Request) {
    return this.campaignsService.create(
      createCampaignDto,
      req.user.id,
      req.organization.id,
    );
  }

  @Get()
  findAll(@Query() query: QueryCampaignsDto, @Req() req: Request) {
    return this.campaignsService.findAll(req.organization.id, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.campaignsService.findOne(id, req.organization.id);
  }

  @Get(':id/analytics')
  getAnalytics(@Param('id') id: string, @Req() req: Request) {
    return this.campaignsService.getAnalytics(id, req.organization.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
    @Req() req: Request,
  ) {
    return this.campaignsService.update(
      id,
      updateCampaignDto,
      req.organization.id,
    );
  }

  @Post(':id/start')
  start(@Param('id') id: string, @Req() req: Request) {
    return this.campaignsService.start(id, req.organization.id);
  }

  @Post(':id/pause')
  pause(@Param('id') id: string, @Req() req: Request) {
    return this.campaignsService.pause(id, req.organization.id);
  }

  @Post(':id/bulk-issue')
  bulkIssue(
    @Param('id') id: string,
    @Body() bulkIssueDto: BulkIssueDto,
    @Req() req: Request,
  ) {
    return this.campaignsService.bulkIssue(
      id,
      bulkIssueDto.recipients,
      req.organization.id,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.campaignsService.remove(id, req.organization.id);
  }
}
