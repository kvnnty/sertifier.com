import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'users', timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true, lowercase: true, index: true })
  email: string;

  @Prop({ required: false })
  passwordHash: string;

  @Prop({ trim: true })
  firstName: string;

  @Prop({ trim: true })
  lastName: string;

  @Prop()
  profileImage?: string;

  @Prop({ default: false, index: true })
  isVerified: boolean;

  @Prop({ default: 'local' })
  authProvider: 'local' | 'google';

  @Prop()
  lastLoginAt?: Date;

  @Prop({ type: Object })
  preferences?: {
    emailNotifications: boolean;
    language: string;
    timezone: string;
  };

  // Virtual field for full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add virtual for fullName
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Transform output
UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});
