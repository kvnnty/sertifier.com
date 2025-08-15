import { Injectable } from "@nestjs/common";
import { Template } from "../templates/schema/template.schema";
import { Campaign } from "../campaigns/schema/campaign.schema";
import { Recipient } from "../recipients/schema/recipients.schema";
import { AnalyticsService } from "../analytics/analytics.service";

@Injectable()
export class AIService {
  constructor(
    private templateAIService: TemplateAIService,
    private contentService: ContentGenerationService,
    private analyticsService : AnalyticsService
  ) {}

  // Template AI methods
  async generateTemplateDesign(description: string) {
    return this.templateAIService.generateFromDescription(description);
  }

  async suggestTemplateOptimizations(template: Template, analytics: any) {
    return this.templateAIService.optimizeDesign(template, analytics);
  }

  async translateTemplate(template: Template, language: string) {
    return this.contentService.translateContent(template, language);
  }

  // Content generation
  async generateCertificateText(context: any) {
    return this.contentService.generateText(context);
  }

  async generateEmailContent(campaign: Campaign, recipient: Recipient) {
    return this.contentService.generateEmailTemplate(campaign, recipient);
  }

  // Personalization
  async personalizeCredential(template: Template, recipient: Recipient) {
    const personalizations =
      await this.contentService.generatePersonalizations(recipient);
    return {
      customMessage: personalizations.message,
      achievementLevel: personalizations.level,
      recommendations: personalizations.nextSteps,
    };
  }

  // Analytics insights
  async generateInsights(organizationId: string, timeRange: string) {
    const data = await this.analyticsService.getRawData(
      organizationId,
      timeRange,
    );
    return this.contentService.generateInsights(data);
  }
}
