"use client";

import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import DateFilter from "./DatePicker";
import DynamicTable, { ColumnConfig } from "../../../DynamicTable";
import CustomPagination from "../Pagination";
import { Loader } from "lucide-react";

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
    fullName: "Jack Moore",
    email: "jack@example.com",
    credentialName: "Award J",
    status: "Delivered",
    credentialId: "C010",
    sendDate: "2025-06-10T17:20:00Z",
  },
];

export default function CredentialsTab() {
  const [filteredCredentials, setFilteredCredentials] =
    useState(mockCredentials);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof (typeof mockCredentials)[0];
    direction: "asc" | "desc" | null;
  } | null>(null);
  const itemsPerPage = 8;

  const filterData = (filteredData: any[]) => {
    let filtered = [...filteredData];

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

    setFilteredCredentials(filtered);
  };

  useEffect(() => {
    filterData(mockCredentials);
  }, [searchTerm, selectedStatuses, sortConfig]);

  const requestSort = (key: keyof (typeof mockCredentials)[0]) => {
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

  const columns: ColumnConfig<(typeof mockCredentials)[0]>[] = [
    { key: "fullName", label: "FULL NAME", sortable: true },
    { key: "email", label: "EMAIL", sortable: true },
    { key: "credentialName", label: "CREDENTIAL NAME", sortable: true },
    { key: "status", label: "STATUS", sortable: false },
    { key: "credentialId", label: "CREDENTIAL ID", sortable: false },
    {
      key: "sendDate",
      label: "SEND DATE",
      sortable: true,
      format: (v) => new Date(v).toLocaleDateString(),
    },
  ];

  const actionsColumn = {
    label: "ACTIONS",
    render: () => (
      <Button variant="ghost" size="sm">
        View
      </Button>
    ),
  };

  return (
    <div className="bg-gray-50 p-4">
      <div className="">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">CREDENTIALS</h2>
          <p className="text-sm text-gray-600 mt-1">
            You can view an overview of issued credentials. Filter the results
            to see specific sending history data.
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex flex-wrap gap-2">
            <DateFilter
              data={mockCredentials}
              getDateField={(item) => item.sendDate}
              onFilterChange={filterData}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button className="bg-[#126F5C]" size="sm">
              Download as Excel File
            </Button>
            <DropdownMenu
              onOpenChange={(open) =>
                !open && setSelectedStatuses([...selectedStatuses])
              }
            >
              <DropdownMenuTrigger asChild>
                <div className="flex border-[1px] border-black px-3 rounded-md items-center gap-1">
                  <div className="w-4 h-4">
                    <Loader className="w-full h-full" />
                  </div>
                  <Button
                    className="border-none bg-none shadow-none hover:bg-none"
                    variant={"outline"}
                    size="sm"
                  >
                    Status
                  </Button>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56" align="end">
                {[
                  "Delivered",
                  "Undelivered",
                  "Opened",
                  "Viewed",
                  "Added to LinkedIn",
                  "Downloaded",
                  "Shared",
                ].map((status) => (
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
                  size="sm"
                  className="mt-2 w-full bg-[#126F5C] hover:bg-[#325c54]"
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
          <DynamicTable
            data={filteredCredentials}
            columns={columns}
            parentComponent="CredentialsTab"
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            actionsColumn={actionsColumn}
          />
        </div>

        <CustomPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredCredentials.length / itemsPerPage)}
          onPageChange={setCurrentPage}
          totalItems={filteredCredentials.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}
