import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrganizationDocument = Organization & Document;

@Schema({ timestamps: true })
export class Organization {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  slug: string;

  @Prop({ trim: true })
  description?: string;

  @Prop()
  logo?: string;

  @Prop({ required: false })
  cover_image?: string;

  @Prop()
  website?: string;

  @Prop({ type: Object })
  contactInfo: {
    email: string;
    phone?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
  };

  @Prop({
    type: String,
    enum: ['trial', 'basic', 'premium', 'enterprise'],
    default: 'trial',
  })
  subscriptionPlan: string;

  @Prop({ type: Object })
  subscriptionLimits: {
    maxCredentials: number;
    maxTemplates: number;
    maxMembers: number;
    maxStorageGB: number;
  };

  @Prop({ type: Object })
  brandingSettings: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    logoPosition: string;
    customCSS?: string;
  };

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

// Add indexes
OrganizationSchema.index({ slug: 1 }, { unique: true });
OrganizationSchema.index({ createdBy: 1 });
OrganizationSchema.index({ isActive: 1 });