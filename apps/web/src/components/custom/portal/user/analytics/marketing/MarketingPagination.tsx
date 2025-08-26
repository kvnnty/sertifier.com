import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function MarketingPagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) onPageChange(page);
  };

  return (
    <div className="mt-4 mx-4 flex flex-col sm:flex-row justify-center items-center font-sans">
      <div className="text-sm text-gray-600">
        Total {totalItems} | {itemsPerPage}/page
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
            handlePageChange(page);
          }}
          className="w-[60px]"
        />
      </div>
    </div>
  );
}
