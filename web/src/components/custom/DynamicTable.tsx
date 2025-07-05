import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export interface ColumnConfig<T> {
  key: keyof T;
  label: string;
  format?: (value: any) => string | number;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  isSelection?: boolean; // Marks the selection column
}

export interface SummaryConfig<T> {
  key: keyof T;
  label: string;
  reduce: (data: T[]) => number;
  format?: (value: number) => string;
}

interface DynamicTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  summaryColumns?: SummaryConfig<T>[];
  className?: string;
  parentComponent?: string;
  currentPage?: number;
  itemsPerPage?: number;
  actionsColumn?: {
    label: string;
    render: (item: T) => React.ReactNode;
  };
  onSelectionChange?: (selectedIds: Set<string>) => void;
  selectedIds?: Set<string>;
  enableSelection?: boolean;
}

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

export default function DynamicTable<T>({
  data,
  columns,
  summaryColumns,
  className = "",
  parentComponent = "",
  currentPage = 1,
  itemsPerPage = 10,
  actionsColumn,
  onSelectionChange,
  selectedIds = new Set<string>(),
  enableSelection = false,
}: DynamicTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: "asc" | "desc" | null;
  } | null>(null);
  const [sortedData, setSortedData] = useState<T[]>(data);

  const requestSort = (key: keyof T) => {
    if (!columns.find((col) => col.key === key)?.sortable) return;

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

    const sorted = [...data].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      const formatA = typeof aValue === "string" ? aValue : Number(aValue);
      const formatB = typeof bValue === "string" ? bValue : Number(bValue);

      if (direction === "asc") {
        return typeof formatA === "number"
          ? formatA - (formatB as number)
          : (formatA as string).localeCompare(formatB as string);
      } else if (direction === "desc") {
        return typeof formatB === "number"
          ? formatB - (formatA as number)
          : (formatB as string).localeCompare(formatA as string);
      }
      return 0;
    });
    setSortedData(sorted);
  };

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const selectionColumn = enableSelection
    ? columns.find((col) => col.isSelection)
    : null;
  const isAllSelected =
    selectionColumn &&
    paginatedData.every((item) =>
      selectedIds.has(item[selectionColumn.key] as string)
    );

  const handleSelectAll = (checked: boolean) => {
    if (selectionColumn && onSelectionChange) {
      const newSelectedIds = new Set(selectedIds);
      if (checked) {
        paginatedData.forEach((item) =>
          newSelectedIds.add(item[selectionColumn.key] as string)
        );
      } else {
        paginatedData.forEach((item) =>
          newSelectedIds.delete(item[selectionColumn.key] as string)
        );
      }
      onSelectionChange(newSelectedIds);
    }
  };

  const handleRowSelect = (item: T, checked: boolean) => {
    if (selectionColumn && onSelectionChange) {
      const newSelectedIds = new Set(selectedIds);
      if (checked) newSelectedIds.add(item[selectionColumn.key] as string);
      else newSelectedIds.delete(item[selectionColumn.key] as string);
      onSelectionChange(newSelectedIds);
    }
  };

  return (
    <div className={`bg-white rounded-md shadow ${className}`}>
      {summaryColumns &&
        summaryColumns.length > 0 &&
        parentComponent === "MarketingTab" && (
          <div className="bg-[#D5DFDD] p-2 px-7 flex justify-between items-center">
            {summaryColumns.map((col) => (
              <SummaryColumn
                key={col.key as string}
                label={col.label}
                value={
                  col.format ? col.format(col.reduce(data)) : col.reduce(data)
                }
              />
            ))}
          </div>
        )}
      <Table>
        <TableHeader>
          <TableRow className="bg-[#E2E2E2]">
            {columns.map((col) => (
              <TableHead
                key={col.key as string}
                className={`w-[${
                  col.label === "AD NAME" || col.label === "AVERAGE SAVING"
                    ? "150"
                    : col.isSelection
                    ? "50"
                    : "120"
                }]px cursor-pointer uppercase text-gray-700 ${
                  col.sortable ? "cursor-pointer" : ""
                }`}
                onClick={() => col.sortable && requestSort(col.key)}
              >
                <div className="flex items-center gap-x-2">
                  {col.isSelection && enableSelection ? (
                    <Checkbox
                      checked={isAllSelected ?? false}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all rows"
                    />
                  ) : (
                    <>
                      <h1>{col.label}</h1>
                      {col.sortable && (
                        <span className="ml-1 flex flex-col items-center leading-none">
                          <span
                            className={`text-[10px] leading-none p-0 m-0 ${
                              sortConfig?.key === col.key &&
                              sortConfig.direction === "asc"
                                ? "text-[#09705b]"
                                : "text-gray-500"
                            }`}
                          >
                            ▲
                          </span>
                          <span
                            className={`text-[10px] leading-none p-0 m-0 ${
                              sortConfig?.key === col.key &&
                              sortConfig.direction === "desc"
                                ? "text-[#09705b]"
                                : "text-gray-500"
                            }`}
                          >
                            ▼
                          </span>
                        </span>
                      )}
                    </>
                  )}
                </div>
              </TableHead>
            ))}
            {actionsColumn && (
              <TableHead
                key="actions"
                className="w-[100px] px cursor-pointer uppercase text-gray-700"
              >
                {actionsColumn.label}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <TableRow
                key={index}
                className={`group ${
                  enableSelection &&
                  selectionColumn &&
                  selectedIds.has(item[selectionColumn.key] as string)
                    ? "bg-[#C2D5D1]"
                    : ""
                }`}
              >
                {columns.map((col) => (
                  <TableCell key={col.key as string}>
                    {col.render ? (
                      col.isSelection && enableSelection ? (
                        <Checkbox
                          checked={selectedIds.has(item[col.key] as string)}
                          onCheckedChange={(checked) =>
                            handleRowSelect(item, checked as boolean)
                          }
                          aria-label={`Select ${item[col.key] as string}`}
                        />
                      ) : (
                        col.render(item)
                      )
                    ) : col.format ? (
                      col.format(item[col.key])
                    ) : (
                      renderCellContent(item[col.key])
                    )}
                  </TableCell>
                ))}
                {actionsColumn && (
                  <TableCell key={`actions-${index}`}>
                    {actionsColumn.render(item)}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + (actionsColumn ? 1 : 0)}
                className="text-center"
              >
                No Data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function renderCellContent(value: unknown) {
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  return JSON.stringify(value);
}
