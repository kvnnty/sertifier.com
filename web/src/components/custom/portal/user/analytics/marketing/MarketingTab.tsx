import { useState, useEffect } from "react";
import Section from "./Section";
import { Funnel } from "lucide-react";
import AdPerformanceTable from "./AdPerformanceTable";
import MarketingPagination from "./MarketingPagination";

interface AnalyticsData {
  date: string;
  viewers: number;
  lastActivity: string;
}

interface Card {
  name: string;
  total: number;
  description?: string;
}

interface SectionProps {
  title: string;
  cards: Card[];
  isFlex?: boolean;
  children?: React.ReactNode;
  data: AnalyticsData[];
}

const initialData: AnalyticsData[] = [
  { date: "12.06.2025", viewers: 0, lastActivity: "2025-06-12T10:00:00Z" },
  { date: "13.06.2025", viewers: 100, lastActivity: "2025-06-13T14:30:00Z" },
  { date: "14.06.2025", viewers: 0, lastActivity: "2025-06-14T09:15:00Z" },
  { date: "10.06.2025", viewers: 100, lastActivity: "2025-06-10T16:45:00Z" },
  { date: "10.06.2025", viewers: 100, lastActivity: "2025-06-10T17:20:00Z" },
  { date: "16.06.2025", viewers: 0, lastActivity: "2025-06-16T11:20:00Z" },
];

export default function MarketingTab() {
  const [activeTimeFilter, setActiveTimeFilter] = useState("all");
  const [sharedData, setSharedData] = useState(initialData);
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Match the design's 10/page

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

  const currentDate = new Date();
  currentDate.setHours(20, 36, 0, 0); // Set to 08:36 PM CAT, June 19, 2025

  const filterData = () => {
    let filtered = [...initialData];

    filtered = filtered.filter((item) => {
      const itemDate = new Date(item.lastActivity);
      const diffDays = Math.floor(
        (currentDate.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      switch (activeTimeFilter) {
        case "today":
          return diffDays === 0;
        case "7days":
          return diffDays <= 7;
        case "30days":
          return diffDays <= 30;
        case "lastMonth":
          const lastMonth = new Date(currentDate);
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          return itemDate >= lastMonth && itemDate <= currentDate;
        case "3m":
          const threeMonthsAgo = new Date(currentDate);
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
          return itemDate >= threeMonthsAgo;
        case "12m":
          const twelveMonthsAgo = new Date(currentDate);
          twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);
          return itemDate >= twelveMonthsAgo;
        case "custom":
          if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            return itemDate >= start && itemDate <= end;
          }
          return true;
        case "all":
        default:
          return true;
      }
    });

    return filtered;
  };

  useEffect(() => {
    const newFilteredData = filterData();
    setSharedData(newFilteredData);
  }, [activeTimeFilter, startDate, endDate]);

  const sections: SectionProps[] = [
    {
      title: "OVERVIEW",
      cards: [
        {
          name: "VIEWERS",
          total: sharedData.reduce((sum, item) => sum + item.viewers, 0),
          description:
            "This graph shows the number of unique visitors who viewed your credential pages.",
        },
        {
          name: "CONTACTED",
          total: sharedData.reduce((sum, item) => sum + item.viewers, 0),
          description:
            "This graph shows how many unique visitors contacted you via your credential pages.",
        },
        {
          name: "WEBSITE VISITS",
          total: sharedData.reduce((sum, item) => sum + item.viewers, 0),
          description:
            "This graph tracks visits to your website from credential page links.",
        },
        {
          name: "VIEWS",
          total: sharedData.reduce((sum, item) => sum + item.viewers, 0),
          description:
            "This graph displays the total number of views on your credential pages.",
        },
      ],
      data: sharedData,
    },
    {
      title: "CREDENTIAL SHARES",
      cards: [
        {
          name: "LinkedIn",
          total: sharedData.reduce((sum, item) => sum + item.viewers, 0),
        },
        {
          name: "X",
          total: sharedData.reduce((sum, item) => sum + item.viewers, 0),
        },
        {
          name: "WhatsApp",
          total: sharedData.reduce((sum, item) => sum + item.viewers, 0),
        },
        {
          name: "Yammer",
          total: sharedData.reduce((sum, item) => sum + item.viewers, 0),
        },
        {
          name: "Xing",
          total: sharedData.reduce((sum, item) => sum + item.viewers, 0),
        },
        {
          name: "Added to LinkedIn Profile",
          total: sharedData.reduce((sum, item) => sum + item.viewers, 0),
        },
        {
          name: "Facebook",
          total: sharedData.reduce((sum, item) => sum + item.viewers, 0),
        },
      ],
      data: sharedData,
    },
    {
      title: "SOCIAL MEDIA TRAFFIC GAINED FROM SENT CREDENTIALS",
      cards: [
        {
          name: "LinkedIn",
          total: sharedData.reduce((sum, item) => sum + item.viewers, 0),
        },
        {
          name: "Facebook",
          total: sharedData.reduce((sum, item) => sum + item.viewers, 0),
        },
        {
          name: "Instagram",
          total: sharedData.reduce((sum, item) => sum + item.viewers, 0),
        },
        {
          name: "X",
          total: sharedData.reduce((sum, item) => sum + item.viewers, 0),
        },
      ],
      data: sharedData,
    },
    {
      title: "ADS",
      cards: [
        {
          name: "Views",
          total: sharedData.reduce((sum, item) => sum + item.viewers, 0),
          description:
            "This graph shows the total number of views on your banner ads.",
        },
        {
          name: "Clicks",
          total: sharedData.reduce((sum, item) => sum + item.viewers, 0),
          description:
            "This graph shows the total number of clicks on your banner ads.",
        },
        {
          name: "Viewers",
          total: sharedData.reduce((sum, item) => sum + item.viewers, 0),
          description:
            "This graph shows the number of unique viewers of your banner ads.",
        },
      ],
      isFlex: true,
      children: (
        <div>
          <h2 className="px-4 pb-4 flex-wrap w-[50rem]">
            This section shows you how your ads are performing. The graphs below
            detail total ad clicks, views, and unique viewers. If you don't see
            any data, create your first banner ad in the Ads feature.
          </h2>
        </div>
      ),
      data: sharedData,
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="p-4 mb-4">
        <div className="flex flex-col items-start">
          <div className="w-full flex justify-between items-center mb-4">
            <div className="max-w-[70%]">
              <h2 className="text-lg font-semibold text-gray-800">MARKETING</h2>
              <p className="text-sm text-gray-600 mt-1">
                Get a general overview of your marketing insights or apply
                filters to view specific sending history data.
              </p>
            </div>
            <div className="border border-gray-200 inline-flex items-center justify-center p-2 rounded-sm">
              <Funnel />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            {timeFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => {
                  setActiveTimeFilter(filter.id);
                  if (filter.id === "custom") setShowCustomDateRange(true);
                  else setShowCustomDateRange(false);
                }}
                className={`px-3 py-1 rounded text-sm border text-black ${
                  activeTimeFilter === filter.id
                    ? "bg-[#cccccc]"
                    : "text-gray-700"
                }`}
              >
                {filter.label}
              </button>
            ))}
            {showCustomDateRange && (
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full sm:w-[150px] p-1 border rounded"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full sm:w-[150px] p-1 border rounded"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="gap-y-5">
        <div className="border border-gray-200 shadow-lg mb-6 p-4">
          {sections.map((section, index) => (
            <Section
              key={section.title}
              title={section.title}
              cards={section.cards}
              isFlex={section.isFlex}
              children={section.children}
              data={section.data}
            />
          ))}
          <AdPerformanceTable />
          <MarketingPagination
            currentPage={currentPage}
            totalPages={Math.ceil(sharedData.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            totalItems={sharedData.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>
    </div>
  );
}
