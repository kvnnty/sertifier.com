"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users } from "lucide-react";
import OrganizationTab from "./tabs/organization-tab";
import MembersTab from "./tabs/members-tab";
import SubscriptionTab from "./tabs/subscriptions-tab";

export default function OrganizationSettings() {
  const [activeTab, setActiveTab] = useState("organization");

  return (
    <div className="py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Organization Settings</h1>
        <p className="text-gray-600 mt-2">Manage your organization details and team members</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
          <TabsTrigger value="organization" className="flex items-center gap-2">
            <Building2 />
            Organization
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users />
            Members
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <Users />
            Subscription & Limits
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organization">
          <OrganizationTab />
        </TabsContent>

        <TabsContent value="members">
          <MembersTab />
        </TabsContent>

        <TabsContent value="subscription">
          <SubscriptionTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
