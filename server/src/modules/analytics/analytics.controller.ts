import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto } from './dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { OrganizationGuard } from '@/common/guards/organization.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard, OrganizationGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboard(@Req() req: Request, @Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getDashboardData(req.organization.id, query);
  }

  @Get('credentials')
  getCredentialAnalytics(
    @Req() req: Request,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getCredentialAnalytics(
      req.organization.id,
      query,
    );
  }

  @Get('campaigns')
  getCampaignAnalytics(@Req() req: Request, @Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getCampaignAnalytics(
      req.organization.id,
      query,
    );
  }

  @Get('recipients')
  getRecipientAnalytics(
    @Req() req: Request,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getRecipientAnalytics(
      req.organization.id,
      query,
    );
  }

  @Get('exports')
  exportAnalytics(@Req() req: Request, @Query() query: AnalyticsQueryDto) {
    return this.analyticsService.exportAnalytics(req.organization.id, query);
  }
}
