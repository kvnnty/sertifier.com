"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Copy, Trash, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { mockAdsData } from "@/lib/mock/mockAdsData";
import DynamicTable, { ColumnConfig } from "@/components/custom/DynamicTable";
import CustomPagination from "@/components/custom/portal/user/Pagination";

interface Ad {
  id: string;
  title: string;
  issueCount: number;
  createDate: string;
  status: "active" | "passive";
}

export default function Ads() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "passive">("active");
  const itemsPerPage = 5;

  const filteredData = mockAdsData.data.items
    .filter((item) => item.status === activeTab)
    .filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const columns: ColumnConfig<Ad>[] = [
    { key: "title", label: "Fullname", sortable: true },
    { key: "issueCount", label: "Credentials", sortable: true },
    {
      key: "createDate",
      label: "Date Created",
      sortable: true,
      format: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const actionsColumn = {
    label: "",
    render: (item: Ad) => (
      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button className="bg-[#086956] rounded-sm">Edit</Button>
        <Button variant="ghost" size="sm">
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    ),
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-4 border-b-[1px] border-t-[1px] bg-white p-5">
        <Button
          className="flex items-center bg-[#086956] text-white hover:bg-[#075548] transition-colors duration-200 px-3 rounded-sm"
          size="sm"
        >
          {" "}
          Create New Ad
        </Button>
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "active" | "passive")}
        >
          <TabsList className="">
            <TabsTrigger value="active" className="">
              Active
            </TabsTrigger>
            <TabsTrigger value="passive" className="">
              Passive
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active"></TabsContent>
          <TabsContent value="passive"></TabsContent>
        </Tabs>
        <div className="relative w-full max-w-[250px]">
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-[1px] border-gray-200 pl-10 pr-4 py-2 rounded-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
        </div>
      </div>
      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4 gap-y-4">
          <img
            src="/images/noCredentials.png"
            alt="No ads found"
            className="mb-4 max-w-[300px] w-full"
          />
          <h1 className="font-bold text-xl mb-2">Let's Create Ads!</h1>
          <p className="text-gray-600 text-center text-lg">
            No ads are available. Start by creating a new ad.
          </p>
          <Button className="flex items-center bg-white border-[1px] border-[#086956] text-[#086956] hover:bg-white">
            <Plus className="text-[#086956]" />
            Create an Ad
          </Button>
          <p className="underline cursor-pointer text-xl">Learn More</p>
        </div>
      ) : (
        <div className="px-4">
          <DynamicTable
            data={filteredData.map((item) => ({
              ...item,
              status: item.status as "active" | "passive",
            }))}
            columns={columns}
            actionsColumn={actionsColumn}
            parentComponent="Ads"
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
}
