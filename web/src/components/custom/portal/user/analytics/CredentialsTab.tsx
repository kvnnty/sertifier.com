"use client";

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

// Mock credential data with timestamps
const mockCredentials = [
  {
    fullName: "Alice Johnson",
    email: "alice@example.com",
    credentialName: "Certificate A",
    status: "Sent",
    credentialId: "C001",
    sendDate: "2025-06-01T10:00:00Z",
  },
  {
    fullName: "Bob Smith",
    email: "bob@example.com",
    credentialName: "Certificate B",
    status: "Delivered",
    credentialId: "C002",
    sendDate: "2025-06-02T14:30:00Z",
  },
  {
    fullName: "Charlie Brown",
    email: "charlie@example.com",
    credentialName: "Diploma C",
    status: "Opened",
    credentialId: "C003",
    sendDate: "2025-06-03T09:15:00Z",
  },
  {
    fullName: "Dana White",
    email: "dana@example.com",
    credentialName: "Award D",
    status: "Pending",
    credentialId: "C004",
    sendDate: "2025-06-04T16:45:00Z",
  },
  {
    fullName: "Eve Davis",
    email: "eve@example.com",
    credentialName: "Certificate E",
    status: "Sent",
    credentialId: "C005",
    sendDate: "2025-06-05T11:20:00Z",
  },
  {
    fullName: "Frank Miller",
    email: "frank@example.com",
    credentialName: "Diploma F",
    status: "Delivered",
    credentialId: "C006",
    sendDate: "2025-06-06T13:10:00Z",
  },
  {
    fullName: "Grace Lee",
    email: "grace@example.com",
    credentialName: "Award G",
    status: "Opened",
    credentialId: "C007",
    sendDate: "2025-06-07T08:50:00Z",
  },
  {
    fullName: "Hank Wilson",
    email: "hank@example.com",
    credentialName: "Certificate H",
    status: "Pending",
    credentialId: "C008",
    sendDate: "2025-06-08T15:30:00Z",
  },
  {
    fullName: "Ivy Taylor",
    email: "ivy@example.com",
    credentialName: "Diploma I",
    status: "Sent",
    credentialId: "C009",
    sendDate: "2025-06-09T12:00:00Z",
  },
  {
    fullName: "Jack Moore",
    email: "jack@example.com",
    credentialName: "Award J",
    status: "Delivered",
    credentialId: "C010",
    sendDate: "2025-06-10T17:20:00Z",
  },
];

export default function CredentialsTab() {
  const [activeTimeFilter, setActiveTimeFilter] = useState("all");
  const [filteredCredentials, setFilteredCredentials] = useState(mockCredentials);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof typeof mockCredentials[0];
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
  currentDate.setHours(18, 41, 0, 0); // Set to 06:41 PM CAT, June 15, 2025

  const filterData = () => {
    let filtered = [...mockCredentials];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (cred) =>
          cred.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cred.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((cred) =>
        selectedStatuses.includes(cred.status.toLowerCase())
      );
    }

    // Filter by time
    filtered = filtered.filter((cred) => {
      const credDate = new Date(cred.sendDate);
      const diffDays = Math.floor(
        (currentDate.getTime() - credDate.getTime()) / (1000 * 60 * 60 * 24)
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
          return credDate >= lastMonth && credDate <= currentDate;
        case "3m":
          const threeMonthsAgo = new Date(currentDate);
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
          return credDate >= threeMonthsAgo;
        case "12m":
          const twelveMonthsAgo = new Date(currentDate);
          twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);
          return credDate >= twelveMonthsAgo;
        case "custom":
          if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); 
            return credDate >= start && credDate <= end;
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
        if (sortConfig.key === "sendDate") {
          return sortConfig.direction === "asc"
            ? new Date(a.sendDate).getTime() - new Date(b.sendDate).getTime()
            : new Date(b.sendDate).getTime() - new Date(a.sendDate).getTime();
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
    setFilteredCredentials(newFiltered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [activeTimeFilter, searchTerm, selectedStatuses, startDate, endDate, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredCredentials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCredentials = filteredCredentials.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const requestSort = (key: keyof typeof mockCredentials[0]) => {
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
          <h2 className="text-xl font-semibold text-gray-800">CREDENTIALS</h2>
          <p className="text-sm text-gray-600 mt-1">
            You can view an overview of issued credentials. Filter the results
            to see specific sending history data.
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
            <Button variant="default" size="sm">
              Download as Excel File
            </Button>
            <DropdownMenu onOpenChange={(open) => !open && setSelectedStatuses([...selectedStatuses])}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Filter by Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                {["Delivered", "Undelivered", "Opened", "Viewed", "Added to LinkedIn", "Downloaded", "Shared"].map((status) => (
                  <div key={status} className="flex items-center space-x-2 p-2">
                    <Checkbox
                      checked={selectedStatuses.includes(status.toLowerCase())}
                      onCheckedChange={(checked) => {
                        setSelectedStatuses((prev) =>
                          checked
                            ? [...prev, status.toLowerCase()]
                            : prev.filter((s) => s !== status.toLowerCase())
                        );
                      }}
                    />
                    <span>{status}</span>
                  </div>
                ))}
                <Button
                  variant="default"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => {
                    setSelectedStatuses([...selectedStatuses]);
                  }}
                >
                  Apply Filters
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
            <Input
              type="text"
              placeholder="Search for names, email address"
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
                <TableHead className="w-[150px] cursor-pointer" onClick={() => requestSort("fullName")}>
                  FULL NAME
                  <span className="ml-1">
                    {sortConfig?.key === "fullName" && (
                      sortConfig.direction === "asc" ? "▲" : "▼"
                    ) || "▲▼"}
                  </span>
                </TableHead>
                <TableHead className="w-[200px] cursor-pointer" onClick={() => requestSort("email")}>
                  EMAIL
                  <span className="ml-1">
                    {sortConfig?.key === "email" && (
                      sortConfig.direction === "asc" ? "▲" : "▼"
                    ) || "▲▼"}
                  </span>
                </TableHead>
                <TableHead className="w-[150px] cursor-pointer" onClick={() => requestSort("credentialName")}>
                  CREDENTIAL NAME
                  <span className="ml-1">
                    {sortConfig?.key === "credentialName" && (
                      sortConfig.direction === "asc" ? "▲" : "▼"
                    ) || "▲▼"}
                  </span>
                </TableHead>
                <TableHead className="w-[120px]">STATUS</TableHead>
                <TableHead className="w-[120px]">CREDENTIAL ID</TableHead>
                <TableHead className="w-[120px] cursor-pointer" onClick={() => requestSort("sendDate")}>
                  SEND DATE
                  <span className="ml-1">
                    {sortConfig?.key === "sendDate" && (
                      sortConfig.direction === "asc" ? "▲" : "▼"
                    ) || "▲▼"}
                  </span>
                </TableHead>
                <TableHead className="w-[100px]">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCredentials.length > 0 ? (
                paginatedCredentials.map((cred, index) => (
                  <TableRow key={index}>
                    <TableCell>{cred.fullName}</TableCell>
                    <TableCell>{cred.email}</TableCell>
                    <TableCell>{cred.credentialName}</TableCell>
                    <TableCell>{cred.status}</TableCell>
                    <TableCell>{cred.credentialId}</TableCell>
                    <TableCell>{new Date(cred.sendDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
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
            Total {filteredCredentials.length} | {itemsPerPage}/page
          </div>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              {'<'}
            </Button>
            <span>{currentPage}</span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              {'>'}
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