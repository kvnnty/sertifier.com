"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CredentialsTab from "@/components/custom/portal/user/analytics/CredentialsTab";
import SummaryTab from "@/components/custom/portal/user/analytics/SummaryTab";
import RecipientEngagementTab from "@/components/custom/portal/user/analytics/RecipientEngagement";
import MarketingTab from "@/components/custom/portal/user/analytics/marketing/MarketingTab";
import RecipientDirectory from "@/components/custom/portal/user/analytics/RecipientDirectory";
import EventLogsTab from "@/components/custom/portal/user/analytics/EventLogs";

const tabs = [
  { id: "summary", label: "Summary" },
  { id: "credentials", label: "Credentials" },
  { id: "marketing", label: "Marketing & Ads" },
  { id: "engagement", label: "Recipient Engagement" },
  { id: "directory", label: "Recipient Directory" },
  { id: "logs", label: "Event Logs" },
];

interface AnalyticsClientProps {
  analyticsData: {
    totalRecipients: number;
    totalCredentials: number;
    successfulDeliveries: number;
    openedEmails: number;
    credentialViews: number;
    addedToLinkedIn: number;
    shared: number;
    downloaded: number;
  };
}

export default function AnalyticsClient({
  analyticsData,
}: AnalyticsClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("active")?.toLowerCase() || "summary";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const validTab = tabs.find((tab) => tab.id === initialTab.toLowerCase());
    if (!validTab) {
      setActiveTab("summary");
      router.replace("/portal/user/analytics?active=summary");
    }
  }, [initialTab, router]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/portal/user/analytics/?active=${value}`);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 bg-white border-b items-center border-gray-200 z-40 flex justify-center py-7">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <main className="p-8">
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
              <RecipientDirectory />
            </TabsContent>
            <TabsContent value="logs">
              <EventLogsTab />
            </TabsContent>
          </div>
        </main>
      </div>
    </Tabs>
  );
}
