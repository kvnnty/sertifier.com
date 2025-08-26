import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface AdPerformance {
  adName: string;
  views: number;
  clicks: number;
  viewedBy: number;
  status: string;
  averageSaving: number;
}

const mockAdData: AdPerformance[] = [
  {
    adName: "Ad Campaign 1",
    views: 0,
    clicks: 0,
    viewedBy: 0,
    status: "Inactive",
    averageSaving: 0,
  },
  {
    adName: "Ad Campaign 2",
    views: 50,
    clicks: 5,
    viewedBy: 45,
    status: "Active",
    averageSaving: 10.5,
  },
  {
    adName: "Ad Campaign 3",
    views: 100,
    clicks: 10,
    viewedBy: 90,
    status: "Paused",
    averageSaving: 15.0,
  },
];

const SummaryColumn = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex flex-col items-center gap-y-3 font-semibold">
    <h1 className="">{label}</h1>
    <h1 className="text-[#09705b]">{value}</h1>
  </div>
);

export default function AdPerformanceTable() {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof AdPerformance;
    direction: "asc" | "desc" | null;
  } | null>(null);
  const [data, setData] = useState(mockAdData);

  const requestSort = (key: keyof AdPerformance) => {
    let direction: "asc" | "desc" | null = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    } else if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "desc"
    ) {
      direction = null;
    }
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      if (key === "adName" || key === "status") {
        return direction === "asc"
          ? (aValue as string).localeCompare(bValue as string)
          : (bValue as string).localeCompare(aValue as string);
      } else {
        return direction === "asc"
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }
    });
    setData(sortedData);
  };

  // Calculate totals
  const totalViews = data.reduce((sum, ad) => sum + ad.views, 0);
  const totalClicks = data.reduce((sum, ad) => sum + ad.clicks, 0);
  const totalViewedBy = data.reduce((sum, ad) => sum + ad.viewedBy, 0);
  const totalAverageSaving =
    data.reduce((sum, ad) => sum + ad.averageSaving, 0) / (data.length || 1);

  return (
    <div className="bg-white rounded-md shadow mx-4">
      <div className="bg-[#D5DFDD] p-2 px-7 flex justify-between items-center">
        <div className="font-semibold">TOTAL</div>
        <SummaryColumn label="VIEWS" value={totalViews} />
        <SummaryColumn label="CLICKS" value={totalClicks} />
        <SummaryColumn label="VIEWED BY" value={totalViewedBy} />
        <SummaryColumn
          label="AVERAGE SAVING"
          value={`$${totalAverageSaving.toFixed(2)}`}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-[#cccccc]">
            <TableHead
              className="w-[150px] cursor-pointer uppercase text-gray-700"
              onClick={() => requestSort("adName")}
            >
              <div className="flex items-center gap-x-2">
                <h1>AD NAME</h1>
                <span className="ml-1 flex flex-col gap-y-0 items-center">
                  <span
                    className={`text-xs ${
                      sortConfig?.key === "adName" &&
                      sortConfig.direction === "asc"
                        ? "text-[#09705b]"
                        : "text-gray-500"
                    }`}
                  >
                    ▲
                  </span>
                  <span
                    className={`text-xs ${
                      sortConfig?.key === "adName" &&
                      sortConfig.direction === "desc"
                        ? "text-[#09705b]"
                        : "text-gray-500"
                    }`}
                  >
                    ▼
                  </span>
                </span>
              </div>
            </TableHead>
            <TableHead
              className="w-[120px] cursor-pointer uppercase text-gray-700"
              onClick={() => requestSort("views")}
            >
              <div className="flex items-center gap-x-2">
                <h1>VIEWS</h1>
                <span className="ml-1 flex flex-col gap-y-0 items-center">
                  <span
                    className={`text-xs ${
                      sortConfig?.key === "views" &&
                      sortConfig.direction === "asc"
                        ? "text-[#09705b]"
                        : "text-gray-500"
                    }`}
                  >
                    ▲
                  </span>
                  <span
                    className={`text-xs ${
                      sortConfig?.key === "views" &&
                      sortConfig.direction === "desc"
                        ? "text-[#09705b]"
                        : "text-gray-500"
                    }`}
                  >
                    ▼
                  </span>
                </span>
              </div>
            </TableHead>
            <TableHead
              className="w-[120px] cursor-pointer uppercase text-gray-700"
              onClick={() => requestSort("clicks")}
            >
              <div className="flex items-center gap-x-2">
                <h1>CLICKS</h1>
                <span className="ml-1 flex flex-col gap-y-0 items-center">
                  <span
                    className={`text-xs ${
                      sortConfig?.key === "clicks" &&
                      sortConfig.direction === "asc"
                        ? "text-[#09705b]"
                        : "text-gray-500"
                    }`}
                  >
                    ▲
                  </span>
                  <span
                    className={`text-xs ${
                      sortConfig?.key === "clicks" &&
                      sortConfig.direction === "desc"
                        ? "text-[#09705b]"
                        : "text-gray-500"
                    }`}
                  >
                    ▼
                  </span>
                </span>
              </div>
            </TableHead>
            <TableHead
              className="w-[120px] cursor-pointer uppercase text-gray-700"
              onClick={() => requestSort("viewedBy")}
            >
              <div className="flex items-center gap-x-2">
                <h1>VIEWED BY</h1>
                <span className="ml-1 flex flex-col gap-y-0 items-center">
                  <span
                    className={`text-xs ${
                      sortConfig?.key === "viewedBy" &&
                      sortConfig.direction === "asc"
                        ? "text-[#09705b]"
                        : "text-gray-500"
                    }`}
                  >
                    ▲
                  </span>
                  <span
                    className={`text-xs ${
                      sortConfig?.key === "viewedBy" &&
                      sortConfig.direction === "desc"
                        ? "text-[#09705b]"
                        : "text-gray-500"
                    }`}
                  >
                    ▼
                  </span>
                </span>
              </div>
            </TableHead>
            <TableHead
              className="w-[120px] cursor-pointer uppercase text-gray-700"
              onClick={() => requestSort("status")}
            >
              <div className="flex items-center gap-x-2">
                <h1>STATUS</h1>

                <span className="ml-1 flex flex-col gap-y-0 items-center">
                  <span
                    className={`text-xs ${
                      sortConfig?.key === "status" &&
                      sortConfig.direction === "asc"
                        ? "text-[#09705b]"
                        : "text-gray-500"
                    }`}
                  >
                    ▲
                  </span>
                  <span
                    className={`text-xs ${
                      sortConfig?.key === "status" &&
                      sortConfig.direction === "desc"
                        ? "text-[#09705b]"
                        : "text-gray-500"
                    }`}
                  >
                    ▼
                  </span>
                </span>
              </div>
            </TableHead>
            <TableHead
              className="w-[150px] cursor-pointer uppercase text-gray-700 font-bold"
              onClick={() => requestSort("averageSaving")}
            >
              <div className="flex items-center gap-x-2">
                <h1>AVERAGE SAVING</h1>
                <span className="ml-1 flex flex-col gap-y-0 items-center">
                  <span
                    className={`text-xs ${
                      sortConfig?.key === "averageSaving" &&
                      sortConfig.direction === "asc"
                        ? "text-[#09705b]"
                        : "text-gray-500"
                    }`}
                  >
                    ▲
                  </span>
                  <span
                    className={`text-xs ${
                      sortConfig?.key === "averageSaving" &&
                      sortConfig.direction === "desc"
                        ? "text-[#09705b]"
                        : "text-gray-500"
                    }`}
                  >
                    ▼
                  </span>
                </span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((ad, index) => (
              <TableRow key={index}>
                <TableCell>{ad.adName}</TableCell>
                <TableCell>{ad.views}</TableCell>
                <TableCell>{ad.clicks}</TableCell>
                <TableCell>{ad.viewedBy}</TableCell>
                <TableCell>{ad.status}</TableCell>
                <TableCell>${ad.averageSaving.toFixed(2)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No Data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
