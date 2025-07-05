<<<<<<< HEAD
"use client";

import CredentialsTab from "@/components/custom/portal/user/analytics/CredentialsTab";
import SummaryTab from "@/components/custom/portal/user/analytics/SummaryTab";
import RecipientEngagementTab from "@/components/custom/portal/user/analytics/RecipientEngagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MarketingTab from "@/components/custom/portal/user/analytics/marketing/MarketingTab";

const tabs = [
  { id: "summary", label: "Summary" },
  { id: "credentials", label: "Credentials" },
  { id: "marketing", label: "Marketing & Ads" },
  { id: "engagement", label: "Recipient Engagement" },
  { id: "directory", label: "Recipient Directory" },
  { id: "logs", label: "Event Logs" },
];

export default function AnalyticsPage() {
  // Mock data
  const analyticsData = {
    totalRecipients: 0,
    totalCredentials: 0,
    successfulDeliveries: 0,
    openedEmails: 0,
    credentialViews: 0,
    addedToLinkedIn: 0,
    shared: 10,
    downloaded: 10,
  };

  return (
    <Tabs defaultValue="summary">
      <div className="min-h-screen bg-gray-50">
        {/* Centered Tabs Navigation */}
        <div className="sticky top-0 bg-white border-b items-center border-gray-200 z-40 flex justify-center py-5">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="marketing">Marketing & Ads</TabsTrigger>
            <TabsTrigger value="engagement">Recipient Engagement</TabsTrigger>
            <TabsTrigger value="directory">Recipients Directory</TabsTrigger>
            <TabsTrigger value="logs">Event Logs</TabsTrigger>
          </TabsList>
        </div>

        <main className="p-8 ">
          <div className="mx-auto">
            <TabsContent value="summary">
              <SummaryTab analyticsData={analyticsData} />
            </TabsContent>

            <TabsContent value="credentials">
              <CredentialsTab />
            </TabsContent>

            <TabsContent value="marketing">
              <MarketingTab />
            </TabsContent>

            <TabsContent value="engagement">
              <RecipientEngagementTab />
            </TabsContent>

            <TabsContent value="directory">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Recipient Directory
              </h1>
            </TabsContent>

            <TabsContent value="logs">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Event Logs
              </h1>
            </TabsContent>
          </div>
        </main>
      </div>
    </Tabs>
=======
import AnalyticsClient from "@/components/custom/portal/user/analytics/AnalyticsClient";
import { Suspense } from "react";

const analyticsData = {
  totalRecipients: 0,
  totalCredentials: 0,
  successfulDeliveries: 0,
  openedEmails: 0,
  credentialViews: 0,
  addedToLinkedIn: 0,
  shared: 10,
  downloaded: 10,
};

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div>Loading analytics...</div>}>
      <AnalyticsClient analyticsData={analyticsData} />
    </Suspense>
>>>>>>> 5d1d701c3d8a3a938a49c598855f25e1f4ddac9d
  );
}
