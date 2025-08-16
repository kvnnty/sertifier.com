import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type AssetDocument = Asset & Document;

export enum AssetType {
  IMAGE = 'image',
  LOGO = 'logo',
  SIGNATURE = 'signature',
  BACKGROUND = 'background',
}

@Schema({ timestamps: true })
export class Asset {
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organizationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  uploadedBy: Types.ObjectId;

  @Prop({ required: true, trim: true })
  filename: string;

  @Prop({ required: true, trim: true })
  originalName: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  url: string;

  @Prop({ enum: AssetType, required: true })
  type: AssetType;

  @Prop({
    width: Number,
    height: Number,
  })
  dimensions: {
    width: number;
    height: number;
  };

  @Prop([String])
  tags: string[];

  @Prop({ default: 0 })
  usageCount: number;
}

export const AssetSchema = SchemaFactory.createForClass(Asset);

AssetSchema.index({ organizationId: 1, type: 1 });
