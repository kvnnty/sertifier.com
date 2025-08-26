import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type RecipientDocument = Recipient & Document;

@Schema({ timestamps: true })
export class Recipient {
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organizationId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ trim: true })
  phone: string;

  @Prop({ trim: true })
  company: string;

  @Prop({ trim: true })
  jobTitle: string;

  @Prop({
    type: Map,
    of: String,
  })
  customFields: Map<string, string>;

  @Prop([String])
  tags: string[];

  @Prop({ default: true })
  isActive: boolean;

  // Derived field for full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

export const RecipientSchema = SchemaFactory.createForClass(Recipient);

RecipientSchema.index({ organizationId: 1, email: 1 }, { unique: true });
RecipientSchema.index({ organizationId: 1, tags: 1 });
