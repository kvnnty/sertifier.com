import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type VerificationDocument = Verification & Document;

@Schema({ timestamps: true })
export class Verification {
  @Prop({ type: Types.ObjectId, ref: 'Credential', required: true })
  credentialId: Types.ObjectId;

  @Prop({ required: true })
  verifierIP: string;

  @Prop({ trim: true })
  verifierUserAgent: string;

  @Prop({ trim: true })
  verifierLocation: string;

  @Prop()
  verifiedAt: Date;

  @Prop({ default: true })
  isSuccessful: boolean;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);

VerificationSchema.index({ credentialId: 1, verifiedAt: -1 });
