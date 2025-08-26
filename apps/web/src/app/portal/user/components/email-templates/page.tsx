"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Edit, Trash, Plus, Search, PlusCircle } from "lucide-react";
import { mockEmailTemplateData } from "@/lib/mock/mockEmailTemplates";
import DynamicTable, { ColumnConfig } from "@/components/custom/DynamicTable";
import CustomPagination from "@/components/custom/portal/user/Pagination";
import { Input } from "@/components/ui/input";

interface EmailTemplate {
  id: string;
  createDate: string;
  title: string;
  template: string | null;
  insideText: string | null;
  buttonColor: string | null;
  customLogo: boolean;
  language: string | null;
  details: string | null;
  isUsed: boolean;
  isDefault: boolean;
  components: string | null;
}

export default function EmailTemplates() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  const filteredData = mockEmailTemplateData.data.items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: ColumnConfig<EmailTemplate>[] = [
    { key: "title", label: "Name", sortable: true },
    {
      key: "createDate",
      label: "Date Created",
      sortable: true,
      format: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const actionsColumn = {
    label: "",
    render: (item: EmailTemplate) => (
      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button variant="ghost" size="sm">
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
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
      {/* <div className="p-4"> */}
      <div className="flex justify-between items-center mb-4 p-4 border-b-[1px] border-t-[1px] bg-white">
        <Button
          className="flex items-center bg-[#086956] text-white hover:text-[#086956] border-2 border-[#086956] hover:border-[#086956] hover:bg-white cursor-pointer transition-colors duration-200 px-3 rounded-sm"
          size="sm"
        >
          {" "}
          Create New Email
        </Button>
        <div className="relative w-full max-w-[250px]">
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-[1px] border-gray-500 pl-10 pr-4 py-2 rounded-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
        </div>
      </div>
      {/* </div> */}
      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4 gap-y-4">
          <img
            src="/images/noEmailTemplates.png"
            alt="No email templates found"
            className="mb-4 max-w-[300px] w-full"
          />
          <h1 className="font-bold text-xl mb-2">Let's Create Templates!</h1>
          <p className="text-gray-600 text-center text-lg max-w-xl mx-auto">
            The credential campaign uses email templates when sending email
            notifications. The template is what recipients receive in their
            inbox when they are notified about their credentials.
          </p>

          <Button className="flex items-center bg-white border-[1px] border-black text-black hover:bg-white">
            <PlusCircle className="text-black" />
            Create an Email Template
          </Button>
          <p className="underline cursor-pointer text-xl">Learn More</p>
        </div>
      ) : (
        <div className="px-4">
          <DynamicTable
            data={filteredData}
            columns={columns}
            actionsColumn={actionsColumn}
            parentComponent="EmailTemplates"
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
