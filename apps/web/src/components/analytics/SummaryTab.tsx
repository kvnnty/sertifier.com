import { SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { Input } from "../ui/input";
import MetricCard from "./MetricCard";
import SimpleStatCard from "./SimpleStatCard";

interface AnalyticsData {
  totalRecipients: number;
  totalCredentials: number;
  successfulDeliveries: number;
  openedEmails: number;
  credentialViews: number;
  addedToLinkedIn: number;
  shared: number;
  downloaded: number;
}
export default function SummaryTab({analyticsData}: { analyticsData: AnalyticsData }) {
  const [activeTab, setActiveTab] = useState("summary");
  const [activeTimeFilter, setActiveTimeFilter] = useState("all");
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
    <div className="animate-fadeIn">
      {/* Summary Header with Title and Description */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">SUMMARY</h2>
        <p className="text-sm text-gray-600 mt-1">
          You can view an overview of sent credentials. Filter the results to
          view specific sending history data.
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
                    activeTimeFilter === filter.id ? "default" : "outline"
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
  );
}
