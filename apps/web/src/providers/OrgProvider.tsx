"use client";

import { useOrganizationManager } from "@/hooks/useOrganizationManager";
import React, { useEffect } from "react";
import { toast } from "sonner";

export default function OrgProvider({ children }: { children: React.ReactNode }) {
  const { loadOrganizations, selectOrganization } = useOrganizationManager();

  useEffect(() => {
    const fetchOrganizations = async () => {
      const organizations = await loadOrganizations();
      if (organizations.length === 0) {
        toast("No organizations found. Please create an organization first.");
        return;
      }
      selectOrganization(organizations[0]);
 
      console.log("Fetched organizations:", organizations);
    };

    fetchOrganizations();
  }, []);
  return <>{children}</>;
}
