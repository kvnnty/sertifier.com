"use client";

import { SetStateAction, useState } from "react";
import SimpleStatCard from "@/components/analytics/SimpleStatCard";
import MetricCard from "@/components/analytics/MetricCard";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const tabs = [
  { id: "summary", label: "Summary" },
  { id: "credentials", label: "Credentials" },
  { id: "marketing", label: "Marketing & Ads" },
  { id: "engagement", label: "Recipient Engagement" },
  { id: "directory", label: "Recipient Directory" },
  { id: "logs", label: "Event Logs" },
];

const timeFilters = [
  { id: "all", label: "All Time" },
  { id: "today", label: "Today" },
  { id: "7days", label: "7 Days" },
  { id: "30days", label: "30 Days" },
  { id: "lastMonth", label: "Last Month" },
  { id: "3m", label: "3M" },
  { id: "12m", label: "12M" },
  { id: "custom", label: "Custom" },
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("summary");
  const [activeTimeFilter, setActiveTimeFilter] = useState("all");
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  const handleTimeFilterClick = (filterId: SetStateAction<string>) => {
    setActiveTimeFilter(filterId);
    if (filterId === "custom") {
      setShowCustomDateRange(true);
    } else {
      setShowCustomDateRange(false);
    }
  };

  const handleApplyCustomDate = () => {
    // Here you would implement the logic to filter data based on custom date range
    console.log("Applying custom date range:", { startDate, endDate });
    // For now, we'll just hide the custom date inputs
    setShowCustomDateRange(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Centered Tabs Navigation */}
      <div className="flex items-center justify-center sticky top-[85px] bg-white border-b border-gray-200 z-40 h-[85px]">
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

      {/* Content Area */}
      <main className="p-4 sm:p-6 ml-16">
        <div className="max-w-7xl mx-auto">
          {activeTab === "summary" && (
            <div className="animate-fadeIn">
              {/* Summary Header with Title and Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">SUMMARY</h2>
                <p className="text-sm text-gray-600 mt-1">
                  You can view an overview of sent credentials. Filter the
                  results to view specific sending history data.
                </p>
              </div>

              {/* Time Filters and Action Buttons */}
              <div className="mb-8">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div className="flex flex-wrap gap-2">
                      {timeFilters.map((filter) => (
                        <Button
                          key={filter.id}
                          onClick={() => handleTimeFilterClick(filter.id)}
                          variant={
                            activeTimeFilter === filter.id
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                        >
                          {filter.label}
                        </Button>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <Button variant="default" size="lg">
                        Bulk download PDFs
                      </Button>
                      <Button variant="outline" size="lg" className="p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>

                  {/* Custom Date Range Selector */}
                  {showCustomDateRange && (
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <div>
                        <label
                          htmlFor="start-date"
                          className="block text-xs text-gray-600 mb-1"
                        >
                          Start Date
                        </label>
                        <Input
                          type="date"
                          id="start-date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-auto"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="end-date"
                          className="block text-xs text-gray-600 mb-1"
                        >
                          End Date
                        </label>
                        <Input
                          type="date"
                          id="end-date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-auto"
                        />
                      </div>
                      <Button
                        onClick={handleApplyCustomDate}
                        variant="default"
                        size="sm"
                        className="mt-5"
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                </CardContent>
              </div>


              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {/* Total Recipients Card */}
                <SimpleStatCard
                  value={analyticsData.totalRecipients}
                  title="TOTAL RECIPIENTS"
                  description="Total number of recipients who have received credentials."
                />

                {/* Successful Deliveries Card */}
                <MetricCard
                  title="SUCCESSFUL DELIVERIES"
                  value={analyticsData.successfulDeliveries}
                  percentage={0}
                  averagePercentage={0}
                />

                {/* Opened Emails Card */}
                <MetricCard
                  title="OPENED EMAILS"
                  value={analyticsData.openedEmails}
                  percentage={0}
                  averagePercentage={0}
                />

                {/* Credential Views Card */}
                <MetricCard
                  title="CREDENTIAL VIEWS"
                  value={analyticsData.credentialViews}
                  percentage={0}
                  averagePercentage={0}
                />

                {/* Total Credentials Card */}
                <SimpleStatCard
                  value={analyticsData.totalCredentials}
                  title="TOTAL CREDENTIALS"
                  description="Total number of credentials sent."
                />

                {/* Added to LinkedIn Card */}
                <MetricCard
                  title="ADDED TO LINKEDIN PROFILE"
                  value={analyticsData.addedToLinkedIn}
                  percentage={0}
                  averagePercentage={0}
                />

                {/* Shared Card */}
                <MetricCard
                  title="SHARED"
                  value={analyticsData.shared}
                  percentage={0}
                  averagePercentage={0}
                />

                {/* Downloaded Card */}
                <MetricCard
                  title="DOWNLOADED"
                  value={analyticsData.downloaded}
                  percentage={0}
                  averagePercentage={0}
                />
              </div>
            </div>
          )}

          {activeTab === "credentials" && (
            <div className="animate-fadeIn">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Credentials Analytics
              </h1>
              {/* Add Credentials specific content */}
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
