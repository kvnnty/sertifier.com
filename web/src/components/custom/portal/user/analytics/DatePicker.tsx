import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateFilterProps {
  onFilterChange: (filteredData: any[]) => void;
  data: any[];
  getDateField: (item: any) => string;
}

export default function DateFilter({
  onFilterChange,
  data,
  getDateField,
}: DateFilterProps) {
  const [activeTimeFilter, setActiveTimeFilter] = useState("all");
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(2025, 5, 22)
  );
  const [filteredData, setFilteredData] = useState(data);

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
  currentDate.setHours(6, 9, 0, 0);

  const filterData = () => {
    let filtered = [...data];

    filtered = filtered.filter((item) => {
      const itemDate = new Date(getDateField(item));
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
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            return itemDate >= startDate && itemDate <= end;
          }
          return true;
        case "all":
        default:
          return true;
      }
    });

    setFilteredData(filtered);
    onFilterChange(filtered);
  };

  useEffect(() => {
    if (activeTimeFilter !== "custom") {
      filterData();
    }
  }, [activeTimeFilter, data]);

  return (
    <div className="flex flex-wrap items-center">
      {timeFilters.map((filter, index) => (
        <Button
          key={filter.id}
          variant={activeTimeFilter === filter.id ? "secondary" : "outline"}
          onClick={() => {
            setActiveTimeFilter(filter.id);
            if (filter.id === "custom") {
              setShowCustomDateRange((prev) => !prev);
            } else {
              setShowCustomDateRange(false);
            }
          }}
          className={`text-sm  ${
            index === 0
              ? "rounded-none rounded-l-md"
              : index === timeFilters.length - 2
              ? " rounded-none rounded-r-md"
              : "rounded-none"
          } ${index === timeFilters.length - 1 ? "mx-3" : "mr-0"}`}
        >
          {filter.label}
        </Button>
      ))}

      {showCustomDateRange && (
        <div className="flex items-center gap-2 mt-2 sm:mt-0 mx-5">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-[150px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate
                  ? format(startDate, "dd.MM.yyyy")
                  : "Pick Start Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-[150px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "dd.MM.yyyy") : "Pick End Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="default"
            onClick={filterData}
            className="bg-[#086956] hover:bg-[#2c4e47]"
          >
            Apply
          </Button>
        </div>
      )}
    </div>
  );
}
