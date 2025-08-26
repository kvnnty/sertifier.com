import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type AnalyticsDocument = Analytics & Document;

export enum AnalyticsEvent {
  CREDENTIAL_ISSUED = 'credential_issued',
  EMAIL_SENT = 'email_sent',
  EMAIL_OPENED = 'email_opened',
  CREDENTIAL_VIEWED = 'credential_viewed',
  CREDENTIAL_VERIFIED = 'credential_verified',
  CREDENTIAL_SHARED = 'credential_shared',
  CREDENTIAL_DOWNLOADED = 'credential_downloaded',
}

@Schema({ timestamps: true })
export class Analytics {
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organizationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Campaign' })
  campaignId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Credential' })
  credentialId: Types.ObjectId;

  @Prop({ enum: AnalyticsEvent, required: true })
  event: AnalyticsEvent;

  @Prop({
    type: Map,
    of: String,
  })
  metadata: Map<string, string>;

  @Prop()
  ipAddress: string;

  @Prop()
  userAgent: string;

  @Prop()
  location: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);

AnalyticsSchema.index({ organizationId: 1, timestamp: -1 });
AnalyticsSchema.index({ campaignId: 1, timestamp: -1 });
AnalyticsSchema.index({ event: 1, timestamp: -1 });