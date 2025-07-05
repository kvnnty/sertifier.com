import { useState, useEffect } from "react";
import Section from "./Section";
import { Funnel } from "lucide-react";
import DateFilter from "../DatePicker";
import DynamicTable, {
  ColumnConfig,
  SummaryConfig,
} from "../../../../DynamicTable";
import CustomPagination from "../../Pagination";

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

interface AdPerformance {
  adName: string;
  views: number;
  clicks: number;
  viewedBy: number;
  status: string;
  averageSaving: number;
  lastActivity: string;
}

const mapAnalyticsToAdPerformance = (data: AnalyticsData[]): AdPerformance[] =>
  data.map((item) => ({
    adName: `Ad_${item.date.replace(/\./g, "_")}`,
    views: item.viewers,
    clicks: Math.floor(item.viewers * 0.05),
    viewedBy: item.viewers,
    status: item.viewers > 0 ? "Active" : "Inactive",
    averageSaving:
      item.viewers > 0 ? Math.round(item.viewers * 0.1 * 10) / 10 : 0,
    lastActivity: item.lastActivity,
  }));

const initialData: AnalyticsData[] = [
  { date: "12.06.2025", viewers: 0, lastActivity: "2025-06-12T10:00:00Z" },
  { date: "13.06.2025", viewers: 100, lastActivity: "2025-06-13T14:30:00Z" },
  { date: "14.06.2025", viewers: 0, lastActivity: "2025-06-14T09:15:00Z" },
  { date: "10.06.2025", viewers: 100, lastActivity: "2025-06-10T16:45:00Z" },
  { date: "10.06.2025", viewers: 100, lastActivity: "2025-06-10T17:20:00Z" },
  { date: "16.06.2025", viewers: 0, lastActivity: "2025-06-16T11:20:00Z" },
];

export default function MarketingTab() {
  const [sharedData, setSharedData] = useState<AnalyticsData[]>(initialData);
  const [adPerformanceData, setAdPerformanceData] = useState<AdPerformance[]>(
    mapAnalyticsToAdPerformance(initialData)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  useEffect(() => {
    setAdPerformanceData(mapAnalyticsToAdPerformance(sharedData));
  }, [sharedData]);

  const columns: ColumnConfig<AdPerformance>[] = [
    { key: "adName", label: "AD NAME", sortable: true },
    { key: "views", label: "VIEWS", sortable: true },
    { key: "clicks", label: "CLICKS", sortable: true },
    { key: "viewedBy", label: "VIEWED BY", sortable: true },
    { key: "status", label: "STATUS", sortable: true },
    {
      key: "averageSaving",
      label: "AVERAGE SAVING",
      sortable: true,
      format: (v) => `$${v.toFixed(2)}`,
    },
    {
      key: "lastActivity",
      label: "LAST ACTIVITY",
      sortable: true,
      format: (v) => new Date(v).toLocaleDateString(),
    },
  ];

  const summaryColumns: SummaryConfig<AdPerformance>[] = [
    {
      key: "views",
      label: "VIEWS",
      reduce: (data) => data.reduce((sum, ad) => sum + ad.views, 0),
    },
    {
      key: "clicks",
      label: "CLICKS",
      reduce: (data) => data.reduce((sum, ad) => sum + ad.clicks, 0),
    },
    {
      key: "viewedBy",
      label: "VIEWED BY",
      reduce: (data) => data.reduce((sum, ad) => sum + ad.viewedBy, 0),
    },
    {
      key: "averageSaving",
      label: "AVERAGE SAVING",
      reduce: (data) =>
        data.reduce((sum, ad) => sum + ad.averageSaving, 0) /
        (data.length || 1),
      format: (v) => `$${v.toFixed(2)}`,
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

          <DateFilter
            data={initialData}
            getDateField={(item) => item.lastActivity}
            onFilterChange={setSharedData}
          />
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
          <DynamicTable
            data={adPerformanceData}
            columns={columns}
            summaryColumns={summaryColumns}
            parentComponent="MarketingTab"
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />
          <CustomPagination
            currentPage={currentPage}
            totalPages={Math.ceil(adPerformanceData.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            totalItems={adPerformanceData.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>
    </div>
  );
}
