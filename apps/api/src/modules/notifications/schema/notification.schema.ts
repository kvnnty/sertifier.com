import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organizationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Campaign' })
  campaignId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Credential' })
  credentialId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Recipient', required: true })
  recipientId: Types.ObjectId;

  @Prop({ enum: NotificationType, required: true })
  type: NotificationType;

  @Prop({ enum: NotificationStatus, default: NotificationStatus.PENDING })
  status: NotificationStatus;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  scheduledAt: Date;

  @Prop()
  sentAt: Date;

  @Prop({ default: 0 })
  attempts: number;

  @Prop()
  lastAttemptAt: Date;

  @Prop()
  errorMessage: string;

  @Prop({
    type: Map,
    of: String,
  })
  metadata: Map<string, string>;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.index({ organizationId: 1, status: 1 });
NotificationSchema.index({ scheduledAt: 1, status: 1 });
NotificationSchema.index({ recipientId: 1, type: 1 });