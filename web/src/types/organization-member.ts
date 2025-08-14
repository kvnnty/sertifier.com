import { User } from "./user";

export type MemberStatus = "active" | "pending" | "suspended" | "left";

export interface OrganizationMember {
  _id: string;
  organizationId: string;
  user: User;
  invitedBy?: User;
  permissions: string[];
  status: MemberStatus;
  invitedAt?: Date;
  joinedAt?: Date;
  leftAt?: Date;
  metadata?: {
    department?: string;
    jobTitle?: string;
    notes?: string;
    displayRole?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
