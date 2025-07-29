import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'users', timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Organization' }], default: [] })
  organizationIds: Types.ObjectId[];

  _id: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Ensure unique index on email
UserSchema.index({ email: 1 }, { unique: true });
