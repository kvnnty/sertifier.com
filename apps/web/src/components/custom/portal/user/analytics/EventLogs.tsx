import { useState, useEffect } from "react";
import { Funnel, Search } from "lucide-react";
import DateFilter from "./DatePicker";
import { Input } from "@/components/ui/input";
import EventCard from "./event/EventCard";
import CustomPagination from "../Pagination";

const initialData = [
  {
    eventName: "Credential Sent",
    explanation: "Credential 'Certificate A' sent to Alice Johnson",
    timestamp: "2025-06-20T14:30:00Z",
  },
  {
    eventName: "Credential Delivered",
    explanation: "Credential 'Award J' delivered to Jack Moore",
    timestamp: "2025-06-21T09:15:00Z",
  },
  {
    eventName: "Recipient Activity",
    explanation: "Alice Johnson viewed credential 'Certificate A'",
    timestamp: "2025-06-21T16:45:00Z",
  },
  {
    eventName: "Credential Shared",
    explanation: "Jack Moore shared 'Award J' on LinkedIn",
    timestamp: "2025-06-22T08:00:00Z",
  },
  {
    eventName: "Credential Downloaded",
    explanation: "Alice Johnson downloaded 'Certificate A'",
    timestamp: "2025-06-22T09:04:00Z",
  },
];

export default function EventLogsTab() {
  const [filteredData, setFilteredData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 3;

  const handleFilterChange = (filtered: any[]) => {
    const combinedFilter = filtered.filter(
      (event) =>
        !searchTerm ||
        event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.explanation.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(combinedFilter);
    setCurrentPage(1); // Reset to first page on filter change
  };

  useEffect(() => {
    // Apply search filter with debounce-like behavior (immediate for simplicity)
    const debounceTimer = setTimeout(() => {
      const filtered = initialData.filter(
        (event) =>
          !searchTerm ||
          event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.explanation.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }, 300); // Reduced debounce for responsiveness, adjustable as needed

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  useEffect(() => {
    // Ensure initial data is set correctly and apply date filter
    handleFilterChange(initialData);
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="p-4 mb-6">
        <div className="flex flex-col items-start">
          <div className="w-full flex justify-between items-center mb-4">
            <div className="max-w-[70%]">
              <h2 className="text-lg font-semibold text-gray-800">
                EVENT LOGS
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                View detailed logs of your sending history and recipient
                activities. Apply filters to refine the data.
              </p>
            </div>
            <div className="gap-x-4 flex items-center justify-center p-2 rounded-sm">
              <div
                className="border border-gray-200 inline-flex items-center justify-center p-2 rounded-sm"
                style={{ height: "40px" }}
              >
                <Funnel />
              </div>
              <div
                className="relative w-full sm:w-[250px]"
                style={{ height: "40px" }}
              >
                <Input
                  type="text"
                  placeholder="Search for names, email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-full bg-white border-[1px] border-gray-200 pl-10 pr-4 py-2"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <DateFilter
              data={initialData}
              getDateField={(item) => item.timestamp}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 border-b-[1px] border-black  pb-2">
          EVENTS
        </h2>
        {paginatedData.length > 0 ? (
          <div className="space-y-4">
            {paginatedData.map((event, index) => (
              <EventCard
                key={index}
                eventName={event.eventName}
                explanation={event.explanation}
                timestamp={event.timestamp}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <img
              src="/images/noData.png"
              alt="No events found"
              className="mb-4"
            />
            <p className="text-gray-600 text-center">
              Your recipients have not performed any events yet.
            </p>
          </div>
        )}
      </div>
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}
