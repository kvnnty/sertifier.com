import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign, CampaignDocument } from './schema/campaign.schema';
import { CredentialsService } from '../credentials/credentials.service';
import {  } from '../recipients/recipients.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { CreateCampaignDto, QueryCampaignsDto, UpdateCampaignDto } from './dto';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
    private credentialsService: CredentialsService,
    private analyticsService: AnalyticsService,
  ) {}

  async create(
    createCampaignDto: CreateCampaignDto,
    userId: string,
    organizationId: string,
  ): Promise<Campaign> {
    const campaign = new this.campaignModel({
      ...createCampaignDto,
      organizationId,
      createdBy: userId,
    });
    return campaign.save();
  }

  async start(id: string, organizationId: string): Promise<Campaign> {
    const campaign = await this.campaignModel
      .findOneAndUpdate(
        { _id: id, organizationId },
        { status: 'active' },
        { new: true },
      )
      .exec();

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    // Trigger credential issuance based on campaign type
    if (campaign.type === 'bulk') {
      await this.processBulkCampaign(campaign);
    } else if (campaign.type === 'automated') {
      await this.setupAutomationTriggers(campaign);
    }

    return campaign;
  }

  async bulkIssue(
    campaignId: string,
    recipients: any[],
    organizationId: string,
  ): Promise<any> {
    const campaign = await this.findOne(campaignId, organizationId);

    const results = await Promise.allSettled(
      recipients.map((recipient) =>
        this.credentialsService.create(
          {
            campaignId,
            templateId: campaign.templateId.toString(),
            recipientData: recipient,
          },
          organizationId,
        ),
      ),
    );

    // Update campaign statistics
    const successCount = results.filter((r) => r.status === 'fulfilled').length;
    await this.campaignModel.updateOne(
      { _id: campaignId },
      { $inc: { credentialsIssued: successCount } },
    );

    return {
      total: recipients.length,
      successful: successCount,
      failed: recipients.length - successCount,
      results,
    };
  }

  async findAll(
    organizationId: string,
    query: QueryCampaignsDto,
  ): Promise<Campaign[]> {
    const { page = 1, limit = 10, status } = query;
    const filter: any = { organizationId };

    if (status) {
      filter.status = status;
    }

    return this.campaignModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }
  async findOne(id: string, organizationId: string): Promise<Campaign> {
    const campaign = await this.campaignModel
      .findOne({ _id: id, organizationId })
      .exec();

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return campaign;
  }

  async getAnalytics(id: string, organizationId: string) {
    // const campaign = await this.findOne(id, organizationId);
    // return this.analyticsService.getCampaignAnalytics(organizationId, {
    //   campaignId: id,
    // });
  }

  private async processBulkCampaign(campaign: Campaign): Promise<void> {
    // Implementation for bulk campaign processing
  }

  private async setupAutomationTriggers(campaign: Campaign): Promise<void> {
    // Implementation for automated campaign triggers
  }

  // ... other standard CRUD methods ...
}
