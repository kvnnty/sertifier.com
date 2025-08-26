import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type IntegrationDocument = Integration & Document;

export enum IntegrationType {
  LMS = 'lms',
  WEBHOOK = 'webhook',
  API = 'api',
  ZAPIER = 'zapier',
}

export enum IntegrationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
}

@Schema({ timestamps: true })
export class Integration {
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organizationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ enum: IntegrationType, required: true })
  type: IntegrationType;

  @Prop({ enum: IntegrationStatus, default: IntegrationStatus.INACTIVE })
  status: IntegrationStatus;

  @Prop({
    type: Map,
    of: String,
  })
  configuration: Map<string, string>;

  @Prop([
    {
      event: {
        type: String,
        enum: [
          'credential_issued',
          'credential_verified',
          'campaign_completed',
        ],
      },
      endpoint: String,
      method: { type: String, enum: ['POST', 'PUT', 'PATCH'], default: 'POST' },
      headers: { type: Map, of: String },
    },
  ])
  webhooks: Array<{
    event: 'credential_issued' | 'credential_verified' | 'campaign_completed';
    endpoint: string;
    method: 'POST' | 'PUT' | 'PATCH';
    headers: Map<string, string>;
  }>;

  @Prop()
  lastSyncAt: Date;

  @Prop({ trim: true })
  lastError: string;

  @Prop({ default: 0 })
  successfulRequests: number;

  @Prop({ default: 0 })
  failedRequests: number;
}

export const IntegrationSchema = SchemaFactory.createForClass(Integration);

IntegrationSchema.index({ organizationId: 1, status: 1 });
