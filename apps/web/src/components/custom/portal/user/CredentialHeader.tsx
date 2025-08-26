"use client";

import { useState } from "react";
import { Funnel, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CredentialHeaderProps {
  onSearch: (term: string) => void;
}

export default function CredentialHeader({ onSearch }: CredentialHeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <div className="p-3 mb-6 border-b-[1px] border-t-[1px] bg-white">
      <div className="flex flex-col items-start">
        <div className="w-full flex justify-between items-center ">
          <div className="max-w-[70%] ">
            <Button className="flex items-center bg-[#086956] text-white hover:bg-[#075548] transition-colors duration-200 cursor-pointer">
              Create New Detail
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="flex items-center bg-[#086956] text-white hover:bg-[#075548] transition-colors duration-200 cursor-pointer">
              <Plus className="text-white" />
              Create New Detail
            </Button>
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
                  onChange={handleSearchChange}
                  className="w-full h-full bg-white border-[1px] border-gray-200 pl-10 pr-4 py-2"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
