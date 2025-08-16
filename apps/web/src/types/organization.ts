export type ContactInfo = {
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
};

export type SubscriptionLimits = {
  maxCredentials: number;
  maxTemplates: number;
  maxMembers: number;
  maxStorageGB: number;
};

export type BrandingSettings = {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logoPosition: string;
  customCSS?: string;
};

export type SubscriptionPlan = "trial" | "basic" | "premium" | "enterprise";

export interface Organization {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  cover_image?: string;
  website?: string;
  contactInfo: ContactInfo;
  subscriptionPlan: SubscriptionPlan;
  subscriptionLimits: SubscriptionLimits;
  brandingSettings: BrandingSettings;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
