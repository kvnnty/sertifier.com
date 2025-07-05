"use client";

import Pagination from "@/components/custom/Pagination";
import CredentialDesignCard from "@/components/custom/portal/certificate/CredentialDesignCard";
import SelectBox from "@/components/custom/portal/certificate/SelectBox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CirclePlus, FilterIcon, SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";

export default function CredentialDesign() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const selectItems = [{ name: "Certificate" }, { name: "Badge" }];

  const credentialDesigns = [
    { category: "Blank", date: "26 June, 2025", time: "Thursday 10:30 AM" },
    { category: "Blank", date: "26 June, 2025", time: "Thursday 10:30 AM" },
    { category: "Blank", date: "26 June, 2025", time: "Thursday 10:30 AM" },
    { category: "Blank", date: "26 June, 2025", time: "Thursday 10:30 AM" },
    { category: "Blank", date: "26 June, 2025", time: "Thursday 10:30 AM" },
    { category: "Blank", date: "26 June, 2025", time: "Thursday 10:30 AM" },
    { category: "Blank", date: "26 June, 2025", time: "Thursday 10:30 AM" },
    { category: "Blank", date: "26 June, 2025", time: "Thursday 10:30 AM" },
    { category: "Blank", date: "26 June, 2025", time: "Thursday 10:30 AM" },
    { category: "Blank", date: "26 June, 2025", time: "Thursday 10:30 AM" },
    { category: "Blank", date: "26 June, 2025", time: "Thursday 10:30 AM" },
    { category: "Blank", date: "26 June, 2025", time: "Thursday 10:30 AM" },
  ];

  //pagination

  const totalPages = Math.ceil(credentialDesigns.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = credentialDesigns.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white flex justify-between items-center h-20 border-b px-12 sticky top-0 z-50">
        <h1 className="text-gray-900 font-bold text-2xl">Credential Design</h1>
        <div className="flex gap-4 items-center">
          <Button
            className="flex items-center gap-2 rounded-md px-6"
            variant="outline"
            size="lg"
          >
            <CirclePlus />
            <span className="text-gray-600 font-medium">Create new Design</span>
          </Button>
          <Button variant="outline" size="default" className="rounded-md">
            <FilterIcon className="h-4 w-4" />
          </Button>
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-md bg-background pl-8 md:w-[200px] lg:w-[336px]"
              // value={searchTerm}
              // onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="rounded-md bg-teal-700 px-8">Continue</Button>
        </div>
      </div>
      <div className="px-12 py-8">
        <div className="flex items-center gap-4">
          {selectItems.map((item, index) => (
            <SelectBox key={index} SelectItemName={item.name} />
          ))}
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(260px,_1fr))] gap-10 py-16">
          {currentItems.map((item, index) => (
            <div key={index}>
              <CredentialDesignCard
                category={item.category}
                date={item.date}
                time={item.time}
              />
            </div>
          ))}
        </div>
        {currentItems.length > 0 && (
          <div className="flex justify-center items-center gap-4 mb-6">
            <p className="font-medium font-sans text-gray-600">
              Total {totalPages}
            </p>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
