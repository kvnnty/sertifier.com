import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import DynamicTable, { ColumnConfig } from "../../../DynamicTable";
import CustomPagination from "../Pagination";

const mockRecipientData = [
  {
    fullName: "Alice Johnson",
    email: "alice@example.com",
    createdDate: "2025-06-01T10:00:00Z",
  },
  {
    fullName: "Bob Smith",
    email: "bob@example.com",
    createdDate: "2025-06-02T14:30:00Z",
  },
  {
    fullName: "Charlie Brown",
    email: "charlie@example.com",
    createdDate: "2025-06-03T09:15:00Z",
  },
];

export default function RecipientDirectoryTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecipients, setFilteredRecipients] =
    useState(mockRecipientData);
  const [currentPage, setCurrentPage] = useState(1);
  const [showTable, setShowTable] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm) {
        const filtered = mockRecipientData.filter(
          (recip) =>
            recip.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recip.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredRecipients(filtered);
        setShowTable(true);
      } else {
        setFilteredRecipients(mockRecipientData);
        setShowTable(false);
      }
      console.log("Search submitted:", searchTerm);
    }, 3000);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const columns: ColumnConfig<(typeof mockRecipientData)[0]>[] = [
    { key: "fullName", label: "FULL NAME", sortable: true },
    { key: "email", label: "EMAIL", sortable: true },
    {
      key: "createdDate",
      label: "CREATED DATE",
      sortable: true,
      format: (v) => new Date(v).toLocaleDateString(),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {!showTable && (
        <div className="min-h-screen flex flex-col items-center justify-center relative">
          <h1 className="text-3xl font-bold mb-4">Recipient Directory</h1>
          <h1 className="text-xl mb-4">
            You can search for recipients that meet a specific criteria.
          </h1>
          <div className="relative w-full max-w-[500px]">
            <Input
              type="text"
              placeholder="Search by name, email, company, or role"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-none pl-12 pr-4 py-6 text-lg"
              style={{
                fontWeight: 600,
                color: "#B5B8C0",
              }}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-black" />
          </div>
        </div>
      )}

      {showTable && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                RECIPIENT DIRECTORY
              </h2>
              <p className="text-sm text-gray-600 mt-1 w-[30rem]">
                You can search for recipients that meet a specific criteria.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative w-full sm:w-[250px]">
                <Input
                  type="text"
                  placeholder="Search by name, email, company, or role"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border-[1px] border-black pl-10 pr-4 py-2"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-md shadow mb-4">
              <DynamicTable
                data={filteredRecipients}
                columns={columns}
                parentComponent="RecipientDirectoryTab"
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
      )}
    </div>
  );
}
