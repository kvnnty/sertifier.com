import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OtpPurpose =
  | 'email_verification'
  | 'password_reset'
  | 'login_verification'
  | 'email_change';

export type OtpDocument = Otp & Document;

@Schema({ timestamps: true })
export class Otp {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  codeHash: string;

  @Prop({ required: true })
  purpose: OtpPurpose;

  @Prop({ default: false })
  used: boolean;

  @Prop({
    required: true,
    expires: 0, // TTL trigger to delete expired otps
  })
  expiresAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
