import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserPermissions } from '../enums/user-permissions.enum';

@Schema({ collection: 'invitations', timestamps: true })
export class Invitation {
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organization: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop([{ type: String, enum: UserPermissions, required: true }])
  permissions: UserPermissions[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  invitedBy: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
  })
  status: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop()
  acceptedAt?: Date;
}

export type InvitationDocument = Invitation & Document;
export const InvitationSchema = SchemaFactory.createForClass(Invitation);
