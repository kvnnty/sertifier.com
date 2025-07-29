import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserPermissions } from '../enums/user-permissions.enum';

export type OrganizationDocument = Organization & Document;

@Schema({ collection: 'organizations', timestamps: true })
export class Organization {
  @Prop({ required: true, default: 'My Organization' })
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: false })
  logo?: string;

  @Prop({ required: false })
  cover_image?: string;

  @Prop({ required: false })
  website?: string;

  @Prop({ required: false })
  contact_email?: string;

  @Prop({ required: false })
  contact_phone?: string;

  @Prop({ required: false })
  country?: string;

  @Prop({ required: false })
  state?: string;

  @Prop({ required: false })
  address?: string;

  @Prop([
    {
      user: { type: Types.ObjectId, ref: 'User', required: true },
      permissions: [{ type: String, enum: UserPermissions, required: true }],
    },
  ])
  members: { user: Types.ObjectId; permissions: UserPermissions[] }[];

  _id: Types.ObjectId;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

// Index for faster lookups by members.user
OrganizationSchema.index({ 'members.user': 1 });
