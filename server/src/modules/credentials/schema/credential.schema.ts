import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type CredentialDocument = Credential & Document;

export enum CredentialStatus {
  ISSUED = 'issued',
  REVOKED = 'revoked',
  EXPIRED = 'expired',
}

@Schema({ timestamps: true })
export class Credential {
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organizationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Campaign', required: true })
  campaignId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Template', required: true })
  templateId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Recipient', required: true })
  recipientId: Types.ObjectId;

  @Prop({ unique: true, required: true })
  credentialId: string; // Public unique identifier

  @Prop({ enum: CredentialStatus, default: CredentialStatus.ISSUED })
  status: CredentialStatus;

  // Dynamic field values populated from template fields
  @Prop({
    type: Map,
    of: String,
  })
  fieldValues: Map<string, string>;

  // Verification
  @Prop({ unique: true, required: true })
  verificationCode: string;

  @Prop()
  qrCodeUrl: string;

  @Prop()
  publicUrl: string;

  // Email delivery tracking
  @Prop()
  emailSentAt: Date;

  @Prop()
  emailOpenedAt: Date;

  @Prop({ default: 0 })
  emailOpenCount: number;

  @Prop({ default: 0 })
  verificationCount: number;

  @Prop()
  lastVerifiedAt: Date;

  // Social sharing tracking
  @Prop({ default: 0 })
  socialShares: number;

  @Prop([
    {
      platform: {
        type: String,
        enum: ['linkedin', 'facebook', 'twitter', 'other'],
      },
      sharedAt: Date,
    },
  ])
  shareHistory: Array<{
    platform: 'linkedin' | 'facebook' | 'twitter' | 'other';
    sharedAt: Date;
  }>;

  @Prop()
  issuedAt: Date;

  @Prop()
  expiresAt: Date;

  @Prop()
  revokedAt: Date;

  @Prop({ trim: true })
  revokedReason: string;
}

export const CredentialSchema = SchemaFactory.createForClass(Credential);

CredentialSchema.index({ credentialId: 1 }, { unique: true });
CredentialSchema.index({ verificationCode: 1 }, { unique: true });
CredentialSchema.index({ organizationId: 1, status: 1 });
CredentialSchema.index({ recipientId: 1 });
CredentialSchema.index({ campaignId: 1 });
