import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'users', timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop()
  profileImage?: string;

  @Prop({ default: true })
  isVerified: boolean;

  @Prop()
  lastLoginAt?: Date;

  @Prop({ type: Object })
  preferences?: {
    emailNotifications: boolean;
    language: string;
    timezone: string;
  };

  @Prop()
  emailVerifiedAt?: Date;

  @Prop()
  phoneNumber?: string;

  @Prop()
  phoneVerifiedAt?: Date;

  @Prop()
  refreshToken?: string;

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
    delete ret.refreshToken;
    delete ret.__v;
    return ret;
  },
});

// Add indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ isActive: 1 });
