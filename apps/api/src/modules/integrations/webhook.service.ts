import { Injectable } from '@nestjs/common';
import { Integration } from './schemas/integration.schema';

@Injectable()
export class WebhookService {
  // constructor(private httpService: HttpService) {}
  // async triggerWebhook(
  //   integration: Integration,
  //   event: string,
  //   data: any,
  // ): Promise<void> {
  //   const webhook = integration.webhooks.find((w) => w.event === event);
  //   if (!webhook) return;
  //   try {
  //     const response = await this.httpService.axiosRef({
  //       method: webhook.method,
  //       url: webhook.endpoint,
  //       data: {
  //         event,
  //         timestamp: new Date().toISOString(),
  //         data,
  //       },
  //       headers: Object.fromEntries(webhook.headers),
  //       timeout: 10000,
  //     });
  //     // Update integration stats
  //     await this.updateIntegrationStats(integration._id, true);
  //   } catch (error) {
  //     console.error('Webhook failed:', error);
  //     await this.updateIntegrationStats(integration._id, false, error.message);
  //   }
  // }
  // private async updateIntegrationStats(
  //   integrationId: string,
  //   success: boolean,
  //   error?: string,
  // ) {
  //   const update = success
  //     ? { $inc: { successfulRequests: 1 }, lastSyncAt: new Date() }
  //     : { $inc: { failedRequests: 1 }, lastError: error };
  // Update integration document
  // Implementation depends on your integrations service
  // }
}
