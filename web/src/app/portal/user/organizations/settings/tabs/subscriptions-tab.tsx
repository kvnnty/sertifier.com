"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axiosClient from "@/config/axios.config";
import { useOrganization } from "@/lib/store/features/organization/organization.selector";
import { Organization } from "@/types/organization";
import { useEffect, useState } from "react";

export default function SubscriptionTab() {
  const { currentOrganization } = useOrganization();
  const [organizationData, setOrganizationData] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentOrganization?._id) return;

    const fetchOrganization = async () => {
      try {
        const res = await axiosClient.get(`/organizations/${currentOrganization._id}`);
        setOrganizationData(res.data);
      } catch (err) {
        console.error("Failed to fetch organization", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [currentOrganization?._id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!organizationData) {
    return <p>No organization data found.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Subscription & Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription & Limits</CardTitle>
          <CardDescription>Current plan: {organizationData.subscriptionPlan}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{organizationData.subscriptionLimits?.maxCredentials?.toLocaleString() || 0}</div>
              <div className="text-sm text-gray-600">Max Credentials</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{organizationData.subscriptionLimits?.maxTemplates || 0}</div>
              <div className="text-sm text-gray-600">Max Templates</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{organizationData.subscriptionLimits?.maxMembers || 0}</div>
              <div className="text-sm text-gray-600">Max Members</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{organizationData.subscriptionLimits?.maxStorageGB || 0}GB</div>
              <div className="text-sm text-gray-600">Storage</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Upgrade now</Button>
      </div>
    </div>
  );
}
