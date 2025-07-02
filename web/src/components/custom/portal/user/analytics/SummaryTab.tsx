"use client"
import { useState } from "react";
import { Button } from "../../../../ui/button";
import { CardContent } from "../../../../ui/card";
import MetricCard from "./MetricCard";
import SimpleStatCard from "./SimpleStatCard";
import DateFilter from "./DatePicker";
import { Funnel } from "lucide-react";

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

interface AnalyticsDataPoint {
  metric: keyof AnalyticsData;
  value: number;
  date: string;
}

export default function SummaryTab({
  analyticsData,
}: {
  analyticsData: AnalyticsData;
}) {
  const [activeTab, setActiveTab] = useState("summary");
  const [filteredData, setFilteredData] =
    useState<AnalyticsData>(analyticsData);

  const mockDataPoints: AnalyticsDataPoint[] = [
    {
      metric: "totalRecipients",
      value: analyticsData.totalRecipients,
      date: "2025-06-22T06:42:00Z",
    },
    {
      metric: "totalCredentials",
      value: analyticsData.totalCredentials,
      date: "2025-06-22T06:42:00Z",
    },
    {
      metric: "successfulDeliveries",
      value: analyticsData.successfulDeliveries,
      date: "2025-06-21T14:00:00Z",
    },
    {
      metric: "openedEmails",
      value: analyticsData.openedEmails,
      date: "2025-06-20T10:00:00Z",
    },
    {
      metric: "credentialViews",
      value: analyticsData.credentialViews,
      date: "2025-06-19T16:00:00Z",
    },
    {
      metric: "addedToLinkedIn",
      value: analyticsData.addedToLinkedIn,
      date: "2025-06-18T09:00:00Z",
    },
    {
      metric: "shared",
      value: analyticsData.shared,
      date: "2025-06-17T13:00:00Z",
    },
    {
      metric: "downloaded",
      value: analyticsData.downloaded,
      date: "2025-06-16T11:00:00Z",
    },
  ];

  const handleFilterChange = (filteredPoints: AnalyticsDataPoint[]) => {
    const newAnalyticsData: AnalyticsData = {
      totalRecipients: 0,
      totalCredentials: 0,
      successfulDeliveries: 0,
      openedEmails: 0,
      credentialViews: 0,
      addedToLinkedIn: 0,
      shared: 0,
      downloaded: 0,
    };

    filteredPoints.forEach((point) => {
      newAnalyticsData[point.metric] =
        (newAnalyticsData[point.metric] || 0) + point.value;
    });

    setFilteredData(newAnalyticsData);
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">SUMMARY</h2>
        <p className="text-sm text-gray-600 mt-1">
          You can view an overview of sent credentials. Filter the results to
          view specific sending history data.
        </p>
      </div>

      < div className="mb-8">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex flex-wrap gap-2">
              <DateFilter
                data={mockDataPoints}
                getDateField={(item) => item.date}
                onFilterChange={handleFilterChange}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button className="bg-[#126F5C]" size="lg">
                Bulk download PDFs
              </Button>
              <Button variant="outline" size="lg" className="p-1">
                <Funnel />
              </Button>
            </div>
          </div>
        </CardContent>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <SimpleStatCard
          value={filteredData.totalRecipients}
          title="TOTAL RECIPIENTS"
          description="Total number of recipients who have received credentials."
        />

        <MetricCard
          title="SUCCESSFUL DELIVERIES"
          value={filteredData.successfulDeliveries}
          percentage={0}
          averagePercentage={0}
        />

        <MetricCard
          title="OPENED EMAILS"
          value={filteredData.openedEmails}
          percentage={0}
          averagePercentage={0}
        />

        <MetricCard
          title="CREDENTIAL VIEWS"
          value={filteredData.credentialViews}
          percentage={0}
          averagePercentage={0}
        />

        <SimpleStatCard
          value={filteredData.totalCredentials}
          title="TOTAL CREDENTIALS"
          description="Total number of credentials sent."
        />

        <MetricCard
          title="ADDED TO LINKEDIN PROFILE"
          value={filteredData.addedToLinkedIn}
          percentage={0}
          averagePercentage={0}
        />

        <MetricCard
          title="SHARED"
          value={filteredData.shared}
          percentage={0}
          averagePercentage={0}
        />

        <MetricCard
          title="DOWNLOADED"
          value={filteredData.downloaded}
          percentage={0}
          averagePercentage={0}
        />
      </div>
    </div>
  );
}
