import { AnalyticsService } from '@/modules/analytics/analytics.service';
import { CampaignsService } from '@/modules/campaigns/campaigns.service';
import { CredentialsService } from '@/modules/credentials/credentials.service';
import { NotificationsService } from '@/modules/notifications/notifications.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor(
    private campaignsService: CampaignsService,
    private credentialsService: CredentialsService,
    private notificationsService: NotificationsService,
    private analyticsService: AnalyticsService,
  ) {}

  // Process scheduled campaigns every minute
  @Cron(CronExpression.EVERY_MINUTE)
  async processScheduledCampaigns() {
    const campaigns = await this.campaignsService.getScheduledCampaigns();

    for (const campaign of campaigns) {
      await this.campaignsService.start(
        campaign._id.toString(),
        campaign.organizationId.toString(),
      );
    }
  }

  // Send pending notifications every 5 minutes
  @Cron('*/5 * * * *')
  async processPendingNotifications() {
    await this.notificationsService.processPendingNotifications();
  }

  // Generate daily analytics reports
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async generateDailyReports() {
    const organizations = await this.organizationsService.getAllActive();

    for (const org of organizations) {
      await this.analyticsService.generateDailyReport(org._id.toString());
    }
  }

  // Clean up expired credentials monthly
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async cleanupExpiredCredentials() {
    await this.credentialsService.markExpiredCredentials();
  }

  // Backup analytics data weekly
  @Cron(CronExpression.EVERY_WEEK)
  async backupAnalytics() {
    await this.analyticsService.backupData();
  }
}
