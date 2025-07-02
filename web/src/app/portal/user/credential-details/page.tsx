
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Copy, Trash, PlusCircle } from "lucide-react";
import { mockCredentialData } from "@/lib/mock/mockCredentials";
import DynamicTable, { ColumnConfig } from "@/components/custom/DynamicTable";
import CustomPagination from "@/components/custom/portal/user/Pagination";
import CredentialHeader from "@/components/custom/portal/user/CredentialHeader";

interface CredentialDetail {
  detail: {
    id: string;
    title: string;
    description: string;
    status: number;
    createDate: string;
  };
  skills: string[];
  supportingDocumentations: string[];
}

export default function Details() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  const filteredData = mockCredentialData.data.items
    .map((item) => ({
      ...item.detail,
      createDate: item.detail.createDate,
    }))
    .filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const columns: ColumnConfig<CredentialDetail["detail"]>[] = [
    { key: "title", label: "Name", sortable: true },
    {
      key: "status",
      label: "Status",
      sortable: true,
      format: (value) =>
        value === 1 ? "Active" : value === 0 ? "Inactive" : "Unknown",
    },
    { key: "description", label: "Description", sortable: true },
    {
      key: "createDate",
      label: "Date Created",
      sortable: true,
      format: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const actionsColumn = {
    label: "",
    render: (item: CredentialDetail["detail"]) => (
      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
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
      <CredentialHeader onSearch={setSearchTerm} />
      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4 gap-y-4">
          <img
            src="/images/noCredentials.png"
            alt="No credentials found"
            className="mb-4 max-w-[300px] w-full"
          />
          <h1 className="font-bold text-xl mb-2">Let's Create Details!</h1>
          <p className="text-gray-600 text-center text-lg">
            The Credential Detail includes the specific information contained
            within it.
          </p>
          <Button className="flex items-center bg-white border-[1px] border-[#086956] text-[#086956] hover:bg-white cursor-pointer">
            <PlusCircle className="text-[#086956]" />
            Create a Detail
          </Button>
          <p className="underline cursor-pointer text-xl">Learn More</p>
        </div>
      ) : (
        <div className="px-4">
          <DynamicTable
            data={filteredData}
            columns={columns}
            actionsColumn={actionsColumn}
            parentComponent="Details"
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
