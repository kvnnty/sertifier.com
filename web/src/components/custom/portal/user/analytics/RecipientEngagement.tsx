import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const mockRecipientData = [
  {
    fullName: "Alice Johnson",
    email: "alice@example.com",
    totalDownloads: 5,
    numberOfCredentials: 2,
    sharedCredentials: 1,
    lastActivity: "2025-06-01T10:00:00Z",
  },
  {
    fullName: "Bob Smith",
    email: "bob@example.com",
    totalDownloads: 3,
    numberOfCredentials: 1,
    sharedCredentials: 0,
    lastActivity: "2025-06-02T14:30:00Z",
  },
  {
    fullName: "Charlie Brown",
    email: "charlie@example.com",
    totalDownloads: 7,
    numberOfCredentials: 3,
    sharedCredentials: 2,
    lastActivity: "2025-06-03T09:15:00Z",
  },
  {
    fullName: "Dana White",
    email: "dana@example.com",
    totalDownloads: 2,
    numberOfCredentials: 1,
    sharedCredentials: 0,
    lastActivity: "2025-06-04T16:45:00Z",
  },
  {
    fullName: "Eve Davis",
    email: "eve@example.com",
    totalDownloads: 4,
    numberOfCredentials: 2,
    sharedCredentials: 1,
    lastActivity: "2025-06-05T11:20:00Z",
  },
  {
    fullName: "Frank Miller",
    email: "frank@example.com",
    totalDownloads: 6,
    numberOfCredentials: 3,
    sharedCredentials: 2,
    lastActivity: "2025-06-06T13:10:00Z",
  },
  {
    fullName: "Grace Lee",
    email: "grace@example.com",
    totalDownloads: 1,
    numberOfCredentials: 1,
    sharedCredentials: 0,
    lastActivity: "2025-06-07T08:50:00Z",
  },
  {
    fullName: "Hank Wilson",
    email: "hank@example.com",
    totalDownloads: 8,
    numberOfCredentials: 4,
    sharedCredentials: 3,
    lastActivity: "2025-06-08T15:30:00Z",
  },
  {
    fullName: "Ivy Taylor",
    email: "ivy@example.com",
    totalDownloads: 3,
    numberOfCredentials: 2,
    sharedCredentials: 1,
    lastActivity: "2025-06-09T12:00:00Z",
  },
  {
    fullName: "Jack Moore",
    email: "jack@example.com",
    totalDownloads: 5,
    numberOfCredentials: 2,
    sharedCredentials: 1,
    lastActivity: "2025-06-10T17:20:00Z",
  },
];

export default function RecipientEngagementTab() {
  const [activeTimeFilter, setActiveTimeFilter] = useState("all");
  const [filteredRecipients, setFilteredRecipients] =
    useState(mockRecipientData);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof (typeof mockRecipientData)[0];
    direction: "asc" | "desc" | null;
  } | null>(null);
  const itemsPerPage = 8;

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
  currentDate.setHours(20, 59, 0, 0); // Set to 08:59 PM CAT, June 16, 2025

  const filterData = () => {
    let filtered = [...mockRecipientData];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (recip) =>
          recip.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recip.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by time
    filtered = filtered.filter((recip) => {
      const recipDate = new Date(recip.lastActivity);
      const diffDays = Math.floor(
        (currentDate.getTime() - recipDate.getTime()) / (1000 * 60 * 60 * 24)
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
          return recipDate >= lastMonth && recipDate <= currentDate;
        case "3m":
          const threeMonthsAgo = new Date(currentDate);
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
          return recipDate >= threeMonthsAgo;
        case "12m":
          const twelveMonthsAgo = new Date(currentDate);
          twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);
          return recipDate >= twelveMonthsAgo;
        case "custom":
          if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            return recipDate >= start && recipDate <= end;
          }
          return true;
        case "all":
        default:
          return true;
      }
    });

    if (sortConfig?.direction) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle date sorting
        if (sortConfig.key === "lastActivity") {
          return sortConfig.direction === "asc"
            ? new Date(a.lastActivity).getTime() -
                new Date(b.lastActivity).getTime()
            : new Date(b.lastActivity).getTime() -
                new Date(a.lastActivity).getTime();
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  useEffect(() => {
    const newFiltered = filterData();
    setFilteredRecipients(newFiltered);
    setCurrentPage(1);
  }, [activeTimeFilter, searchTerm, startDate, endDate, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredRecipients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRecipients = filteredRecipients.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const requestSort = (key: keyof (typeof mockRecipientData)[0]) => {
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
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            RECIPIENT LEADERBOARD
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            You can see a general overview of your recipients' activities. Click
            "Details" to view detailed insights and activities for each
            recipient.
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex flex-wrap gap-2">
            {timeFilters.map((filter) => (
              <Button
                key={filter.id}
                onClick={() => {
                  setActiveTimeFilter(filter.id);
                  if (filter.id === "custom") setShowCustomDateRange(true);
                  else setShowCustomDateRange(false);
                }}
                variant={activeTimeFilter === filter.id ? "default" : "outline"}
                size="sm"
              >
                {filter.label}
              </Button>
            ))}
            {showCustomDateRange && (
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full sm:w-[150px]"
                />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full sm:w-[150px]"
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Search for names, email addresses, and IDs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[250px]"
            />
          </div>
        </div>

        <div className="bg-white rounded-md shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="w-[150px] cursor-pointer"
                  onClick={() => requestSort("fullName")}
                >
                  FULL NAME
                  <span className="ml-1">
                    {(sortConfig?.key === "fullName" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")) ||
                      "▲▼"}
                  </span>
                </TableHead>
                <TableHead
                  className="w-[200px] cursor-pointer"
                  onClick={() => requestSort("email")}
                >
                  EMAIL
                  <span className="ml-1">
                    {(sortConfig?.key === "email" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")) ||
                      "▲▼"}
                  </span>
                </TableHead>
                <TableHead
                  className="w-[150px] cursor-pointer"
                  onClick={() => requestSort("totalDownloads")}
                >
                  TOTAL DOWNLOADS
                  <span className="ml-1">
                    {(sortConfig?.key === "totalDownloads" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")) ||
                      "▲▼"}
                  </span>
                </TableHead>
                <TableHead
                  className="w-[150px] cursor-pointer"
                  onClick={() => requestSort("numberOfCredentials")}
                >
                  NUMBER OF CREDENTIALS
                  <span className="ml-1">
                    {(sortConfig?.key === "numberOfCredentials" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")) ||
                      "▲▼"}
                  </span>
                </TableHead>
                <TableHead
                  className="w-[150px] cursor-pointer"
                  onClick={() => requestSort("sharedCredentials")}
                >
                  SHARED CREDENTIALS
                  <span className="ml-1">
                    {(sortConfig?.key === "sharedCredentials" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")) ||
                      "▲▼"}
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRecipients.length > 0 ? (
                paginatedRecipients.map((recip, index) => (
                  <TableRow key={index}>
                    <TableCell>{recip.fullName}</TableCell>
                    <TableCell>{recip.email}</TableCell>
                    <TableCell>{recip.totalDownloads}</TableCell>
                    <TableCell>{recip.numberOfCredentials}</TableCell>
                    <TableCell>{recip.sharedCredentials}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No Data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center font-sans">
          <div className="text-sm text-gray-600">
            Total {filteredRecipients.length} | {itemsPerPage}/page
          </div>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              {"<"}
            </Button>
            <span>{currentPage}</span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              {">"}
            </Button>
            <span>Go to</span>
            <Input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= totalPages) setCurrentPage(page);
              }}
              className="w-[60px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
