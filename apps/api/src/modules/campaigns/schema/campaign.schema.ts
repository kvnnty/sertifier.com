import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type CampaignDocument = Campaign & Document;

export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum CampaignType {
  MANUAL = 'manual',
  AUTOMATED = 'automated',
  BULK = 'bulk',
  API = 'api',
}

@Schema({ timestamps: true })
export class Campaign {
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organizationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Template', required: true })
  templateId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description: string;

  @Prop({ enum: CampaignType, required: true })
  type: CampaignType;

  @Prop({ enum: CampaignStatus, default: CampaignStatus.DRAFT })
  status: CampaignStatus;

  // Email Configuration
  @Prop({
    type: {
      subject: String,
      message: String,
      senderName: String,
      replyTo: String,
    },
  })
  emailConfig: {
    subject: string;
    message: string;
    senderName: string;
    replyTo: string;
  };

  // Auto-issuance rules for automated campaigns
  @Prop({
    type: {
      triggerEvent: {
        type: String,
        enum: [
          'course_completion',
          'event_attendance',
          'manual_approval',
          'date_based',
        ],
      },
      conditions: [
        {
          field: String,
          operator: {
            type: String,
            enum: ['equals', 'contains', 'greater_than', 'less_than'],
          },
          value: String,
        },
      ],
      delay: { type: Number, default: 0 }, // in minutes
    },
  })
  automationRules: {
    triggerEvent:
      | 'course_completion'
      | 'event_attendance'
      | 'manual_approval'
      | 'date_based';
    conditions: Array<{
      field: string;
      operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
      value: string;
    }>;
    delay: number;
  };

  @Prop()
  scheduledAt: Date;

  @Prop()
  expiresAt: Date;

  @Prop({ default: 0 })
  credentialsIssued: number;

  @Prop({ default: 0 })
  emailsSent: number;

  @Prop({ default: 0 })
  emailsOpened: number;

  @Prop([String])
  tags: string[];
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);

CampaignSchema.index({ organizationId: 1, status: 1 });
CampaignSchema.index({ organizationId: 1, type: 1 });
CampaignSchema.index({ scheduledAt: 1 });
