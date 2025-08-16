"use client";

import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  const [inputPage, setInputPage] = useState("");

  const renderPages = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages.map((page, index) => {
      if (page === "...") {
        return (
          <span key={index} className="px-2 text-[#23323B] text-sm">
            ...
          </span>
        );
      }

      const isActive = page === currentPage;
      return (
        <button
          key={index}
          onClick={() => onPageChange(Number(page))}
          className={`h-8 w-8 rounded-full text-sm font-medium ${
            isActive
              ? " bg-[#428f7d] text-white"
              : "text-black hover:bg-gray-200"
          }`}
        >
          {page}
        </button>
      );
    });
  };

  const handleGoToPage = () => {
    const pageNum = Number(inputPage);
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setInputPage("");
    }
  };

  return (
    <div className="flex items-center gap-6 font-[Poppins] text-[14px] text-black">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="text-gray-500 hover:bg-[#428f7d] hover:text-white disabled:opacity-30 border-none bg-gray-200 rounded-sm"
      >
        <FaChevronLeft className="mx-2" />
      </Button>

      {renderPages()}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="text-gray-500 hover:bg-[#428f7d] hover:text-white disabled:opacity-30 border-none bg-gray-200 rounded-sm"
      >
        <FaChevronRight  className="mx-2"/>
      </Button>

      <p className="ml-4 text-gray-600 font-sans font-medium">Go to</p>
      <Input
        type="number"
        value={inputPage}
        onChange={(e) => setInputPage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleGoToPage()}
        // className="w-10 h-6 border border-[#465055] "
        className="py-2 ps-4 text-gray-800 w-16 outline-none border-[1px] border-gray-400 rounded-sm "
      />
    </div>
  );
};

export default Pagination;
