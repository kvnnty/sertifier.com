
export interface IUserPreferences {
  emailNotifications: boolean;
  language: string;
  timezone: string;
}

export interface IUser {
  _id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  isVerified: boolean;
  lastLoginAt?: Date;
  preferences?: IUserPreferences;
  emailVerifiedAt?: Date;
  phoneNumber?: string;
  phoneVerifiedAt?: Date;
  refreshToken?: string;
  fullName?: string;
}
