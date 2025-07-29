import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrganizationMemberDocument = OrganizationMember & Document;

@Schema({ timestamps: true })
export class OrganizationMember {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organizationId: Types.ObjectId;

  @Prop({ type: [String], required: true })
  permissions: string[]; // Direct permission assignment

  @Prop({
    type: String,
    enum: ['active', 'pending', 'suspended', 'left'],
    default: 'active',
  })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  invitedBy?: Types.ObjectId;

  @Prop()
  invitedAt?: Date;

  @Prop({ default: Date.now })
  joinedAt?: Date;

  @Prop()
  leftAt?: Date;

  @Prop({ type: Object })
  metadata?: {
    department?: string;
    jobTitle?: string;
    notes?: string;
    displayRole?: string; // Optional: for UI display like "Manager", "Admin"
  };
}

export const OrganizationMemberSchema =
  SchemaFactory.createForClass(OrganizationMember);

// Compound unique index
OrganizationMemberSchema.index(
  { userId: 1, organizationId: 1 },
  { unique: true },
);

// Other indexes
OrganizationMemberSchema.index({ organizationId: 1, status: 1 });
OrganizationMemberSchema.index({ userId: 1, status: 1 });
