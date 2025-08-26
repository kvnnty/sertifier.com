import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function CustomPagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="mt-4 flex flex-col sm:flex-row justify-between items-center px-4 py-2 font-sans">
      <div className="text-sm text-gray-600">
        Total {totalItems} item{totalItems !== 1 ? "s" : ""} | {itemsPerPage}
        /page
      </div>
      <div className="flex items-center space-x-2">
        <Button
          aria-label="Previous page"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="w-8 h-8"
        >
          {"<"}
        </Button>
        <span className="text-sm font-medium" aria-live="polite">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          aria-label="Next page"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="w-8 h-8"
        >
          {">"}
        </Button>
        <span className="text-sm">Go to</span>
        <Input
          type="number"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={(e) => {
            const page = parseInt(e.target.value) || 1;
            handlePageChange(page);
          }}
          className="w-[60px] p-1 text-center border border-gray-300 rounded"
          aria-label="Go to page"
        />
      </div>
    </div>
  );
}
