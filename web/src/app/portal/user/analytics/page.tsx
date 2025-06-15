"use client";

import { SetStateAction, useState } from "react";
import CredentialsTab from "@/components/analytics/CredentialsTab";
import SummaryTab from "@/components/analytics/SummaryTab";

const tabs = [
  { id: "summary", label: "Summary" },
  { id: "credentials", label: "Credentials" },
  { id: "marketing", label: "Marketing & Ads" },
  { id: "engagement", label: "Recipient Engagement" },
  { id: "directory", label: "Recipient Directory" },
  { id: "logs", label: "Event Logs" },
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("summary");

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
    <div className="min-h-screen bg-gray-50">
      {/* Centered Tabs Navigation */}
      <div className="sticky top-[73px] bg-white border-b border-gray-200 z-40">
        <div className="ml-16 max-w-7xl mx-auto px-4">
          <div className="flex justify-center">
            <nav className="flex overflow-x-auto hide-scrollbar -mb-px">
              <div className="flex min-w-full sm:min-w-0 justify-start sm:justify-center">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      inline-flex items-center px-4 sm:px-6 py-4 text-sm font-medium whitespace-nowrap
                      border-b-2 transition-colors duration-200
                      ${
                        activeTab === tab.id
                          ? "border-green-600 text-green-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>

      <main className="p-4 sm:p-6 ml-16">
        <div className="max-w-7xl mx-auto">
          {activeTab === "summary" && (
            <SummaryTab analyticsData={analyticsData}/>
          )}

          {activeTab === "credentials" && (
            <div className="animate-fadeIn">
              <CredentialsTab/>
            </div>
          )}
  
          {activeTab === "marketing" && (
            <div className="animate-fadeIn">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Marketing & Ads Analytics
              </h1>
              {/* Add Marketing specific content */}
            </div>
          )}

          {activeTab === "engagement" && (
            <div className="animate-fadeIn">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Recipient Engagement
              </h1>
              {/* Add Engagement specific content */}
            </div>
          )}

          {activeTab === "directory" && (
            <div className="animate-fadeIn">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Recipient Directory
              </h1>
              {/* Add Directory specific content */}
            </div>
          )}

          {activeTab === "logs" && (
            <div className="animate-fadeIn">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Event Logs
              </h1>
              {/* Add Logs specific content */}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
