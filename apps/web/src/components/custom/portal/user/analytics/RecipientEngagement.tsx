import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import DynamicTable, { ColumnConfig } from "../../../DynamicTable";
import CustomPagination from "../Pagination";

const mockRecipientData = [
  {
    fullName: "Alice Johnson",
    email: "alice@example.com",
    totalDownloads: 5,
    numberOfCredentials: 2,
    sharedCredentials: 1,
  },
  {
    fullName: "Bob Smith",
    email: "bob@example.com",
    totalDownloads: 3,
    numberOfCredentials: 1,
    sharedCredentials: 0,
  },
  {
    fullName: "Charlie Brown",
    email: "charlie@example.com",
    totalDownloads: 7,
    numberOfCredentials: 3,
    sharedCredentials: 2,
  },
  {
    fullName: "Dana White",
    email: "dana@example.com",
    totalDownloads: 2,
    numberOfCredentials: 1,
    sharedCredentials: 0,
  },
  {
    fullName: "Eve Davis",
    email: "eve@example.com",
    totalDownloads: 4,
    numberOfCredentials: 2,
    sharedCredentials: 1,
  },
  {
    fullName: "Frank Miller",
    email: "frank@example.com",
    totalDownloads: 6,
    numberOfCredentials: 3,
    sharedCredentials: 2,
  },
  {
    fullName: "Grace Lee",
    email: "grace@example.com",
    totalDownloads: 1,
    numberOfCredentials: 1,
    sharedCredentials: 0,
  },
  {
    fullName: "Hank Wilson",
    email: "hank@example.com",
    totalDownloads: 8,
    numberOfCredentials: 4,
    sharedCredentials: 3,
  },
  {
    fullName: "Ivy Taylor",
    email: "ivy@example.com",
    totalDownloads: 3,
    numberOfCredentials: 2,
    sharedCredentials: 1,
  },
  {
    fullName: "Jack Moore",
    email: "jack@example.com",
    totalDownloads: 5,
    numberOfCredentials: 2,
    sharedCredentials: 1,
  },
];

export default function RecipientEngagementTab() {
  const [filteredRecipients, setFilteredRecipients] =
    useState(mockRecipientData);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof (typeof mockRecipientData)[0];
    direction: "asc" | "desc" | null;
  } | null>(null);
  const itemsPerPage = 8;

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

    if (sortConfig?.direction) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

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
  }, [searchTerm, sortConfig]);

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

  const columns: ColumnConfig<(typeof mockRecipientData)[0]>[] = [
    { key: "fullName", label: "FULL NAME", sortable: true },
    { key: "email", label: "EMAIL", sortable: true },
    { key: "totalDownloads", label: "TOTAL DOWNLOADS", sortable: true },
    {
      key: "numberOfCredentials",
      label: "NUMBER OF CREDENTIALS",
      sortable: true,
    },
    { key: "sharedCredentials", label: "SHARED CREDENTIALS", sortable: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="">
        <div className="flex justify-between items-center">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              RECIPIENT LEADERBOARD
            </h2>
            <p className="text-sm text-gray-600 mt-1 w-[30rem]">
              You can see a general overview of your recipients' activities.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative w-full sm:w-[250px]">
              <Input
                type="text"
                placeholder="Search for names, email addresses, and IDs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-[1px] border-black pl-10 pr-4 py-2"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md shadow">
          <DynamicTable
            data={filteredRecipients}
            columns={columns}
            parentComponent="RecipientEngagementTab"
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />
        </div>

        <CustomPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredRecipients.length / itemsPerPage)}
          onPageChange={setCurrentPage}
          totalItems={filteredRecipients.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}
