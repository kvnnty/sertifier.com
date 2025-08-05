
export type MemberStatus = "active" | "pending" | "suspended" | "left";

export interface OrganizationMemberType {
  id: string;
  userId: string;
  organizationId: string;
  permissions: string[];
  status: MemberStatus;
  invitedBy?: string;
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
