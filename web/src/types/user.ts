export interface UserPreferences {
  emailNotifications: boolean;
  language: string;
  timezone: string;
}

export interface User {
  _id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  isVerified: boolean;
  lastLoginAt?: Date;
  preferences?: UserPreferences;
  emailVerifiedAt?: Date;
  phoneNumber?: string;
  phoneVerifiedAt?: Date;
  refreshToken?: string;
  fullName?: string;
}
