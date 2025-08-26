import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TemplateDocument = Template & Document;

export enum TemplateType {
  CERTIFICATE = 'certificate',
  BADGE = 'badge',
}

export enum TemplateStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

@Schema({ timestamps: true })
export class Template {
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organizationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description: string;

  @Prop({ enum: TemplateType, required: true })
  type: TemplateType;

  @Prop({ enum: TemplateStatus, default: TemplateStatus.DRAFT })
  status: TemplateStatus;

  // Design Configuration
  @Prop({
    type: {
      width: { type: Number, default: 800 },
      height: { type: Number, default: 600 },
      backgroundColor: { type: String, default: '#ffffff' },
      backgroundImage: { type: Types.ObjectId, ref: 'Asset' },
      elements: [
        {
          id: String,
          type: { type: String, enum: ['text', 'image', 'qr', 'signature'] },
          content: String,
          x: Number,
          y: Number,
          width: Number,
          height: Number,
          fontSize: Number,
          fontFamily: String,
          fontColor: String,
          fontWeight: String,
          textAlign: String,
          rotation: Number,
          opacity: Number,
        },
      ],
    },
  })
  design: {
    width: number;
    height: number;
    backgroundColor: string;
    backgroundImage?: Types.ObjectId;
    elements: Array<{
      id: string;
      type: 'text' | 'image' | 'qr' | 'signature';
      content: string;
      x: number;
      y: number;
      width: number;
      height: number;
      fontSize?: number;
      fontFamily?: string;
      fontColor?: string;
      fontWeight?: string;
      textAlign?: string;
      rotation?: number;
      opacity?: number;
    }>;
  };

  // Fields that can be populated dynamically
  @Prop([
    {
      name: { type: String, required: true },
      label: String,
      type: { type: String, enum: ['text', 'date', 'number'], default: 'text' },
      required: { type: Boolean, default: false },
      defaultValue: String,
    },
  ])
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'date' | 'number';
    required: boolean;
    defaultValue?: string;
  }>;

  @Prop({ default: 0 })
  usageCount: number;

  @Prop([String])
  tags: string[];
}

export const TemplateSchema = SchemaFactory.createForClass(Template);

TemplateSchema.index({ organizationId: 1, status: 1 });
TemplateSchema.index({ organizationId: 1, type: 1 });
TemplateSchema.index({ tags: 1 });
