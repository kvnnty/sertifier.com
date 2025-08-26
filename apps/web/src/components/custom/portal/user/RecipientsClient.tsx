"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  mockRecipientData,
  mockRecipientItemsData,
} from "@/lib/mock/mockRecipients";
import { ColumnConfig } from "@/components/custom/DynamicTable";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Copy, Trash, Plus, Funnel, PlusCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import DynamicTable from "@/components/custom/DynamicTable";
import CustomPagination from "@/components/custom/portal/user/Pagination";

interface List {
  id: string;
  listName: string;
  recipients: number;
  sentCredentials: number;
  createDate: string;
  createdBy: string;
}

interface Recipient {
  id: string;
  fullName: string;
  email: string;
  createDate: string;
}

export default function RecipientsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"lists" | "recipients">("lists");
  const [selectedRecipients, setSelectedRecipients] = useState<Set<string>>(
    new Set()
  );
  const itemsPerPage = 5;

  useEffect(() => {
    const tabFromUrl = searchParams.get("active");
    if (tabFromUrl === "lists" || tabFromUrl === "recipients") {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("active", activeTab);
    router.push(`?${currentParams.toString()}`, { scroll: false });
  }, [activeTab, router, searchParams]);

  const listsData = mockRecipientData.data.items.filter((item) =>
    item.listName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const recipientsData = mockRecipientItemsData.data.items.filter(
    (item) =>
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columnsLists: ColumnConfig<List>[] = [
    { key: "listName", label: "Full Name", sortable: true },
    { key: "recipients", label: "Recipients", sortable: true },
    { key: "sentCredentials", label: "Sent Credentials", sortable: true },
    {
      key: "createDate",
      label: "Date Created",
      sortable: true,
      format: (value) =>
        new Date(value).toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        }),
    },
    { key: "createdBy", label: "Created By", sortable: true },
  ];

  const columnsRecipients: ColumnConfig<Recipient>[] = [
    {
      key: "id",
      label: "Selection",
      sortable: false,
      isSelection: true,
      render: (item) => (
        <Checkbox
          checked={selectedRecipients.has(item.id)}
          onCheckedChange={(checked: boolean) => {
            const newSet = new Set(selectedRecipients);
            if (checked) newSet.add(item.id);
            else newSet.delete(item.id);
            setSelectedRecipients(newSet);
          }}
          aria-label={`Select ${item.fullName}`}
        />
      ),
    },
    { key: "fullName", label: "Full Name", sortable: true },
    { key: "email", label: "E-Mail", sortable: true },
    {
      key: "createDate",
      label: "Date Created",
      sortable: true,
      format: (value) =>
        new Date(value).toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        }),
    },
  ];

  const actionsColumn = {
    label: "",
    render: (item: List | Recipient) => (
      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button variant="ghost" size="sm" aria-label="Edit">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" aria-label="Duplicate">
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" aria-label="Delete">
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    ),
  };

  const paginatedData = (
    activeTab === "lists" ? listsData : recipientsData
  ).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(
    (activeTab === "lists" ? listsData.length : recipientsData.length) /
      itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 px-5">
      {activeTab === "recipients" && selectedRecipients.size > 0 ? (
        <div className="flex space-x-3 justify-end p-5 border-b-[1px] mb-5">
          <Button
            className="bg-[#9D0C21] text-white cursor-pointer hover:bg-[#9d0c22cc] transition-colors duration-200 px-4 rounded-sm"
            aria-label="Delete selected recipients"
          >
            Delete Selected
          </Button>
          <Button
            className="bg-[#086956] text-white cursor-pointer hover:bg-[#086956] transition-colors duration-200 px-4 rounded-sm"
            aria-label="Add selected recipients to a list"
          >
            Add Selected Items to a List
          </Button>
        </div>
      ) : (
        <div className="flex justify-between items-center mb-4 p-4">
          <Button
            className="flex items-center bg-[#086956] text-white hover:bg-[#075548] transition-colors duration-200 px-3 rounded-md"
            size="sm"
            aria-label={
              activeTab === "lists" ? "Create a List" : "Add Recipients"
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            {activeTab === "lists" ? "Create a List" : "Add Recipients"}
          </Button>
          <div className="flex items-center space-x-4">
            <Tabs
              value={activeTab}
              onValueChange={(v: string) =>
                setActiveTab(v as "lists" | "recipients")
              }
            >
              <TabsList className=" rounded-md">
                <TabsTrigger value="lists" className="">
                  Lists
                </TabsTrigger>
                <TabsTrigger value="recipients" className="">
                  Recipients
                </TabsTrigger>
              </TabsList>
              <TabsContent value="lists"></TabsContent>
              <TabsContent value="recipients"></TabsContent>
            </Tabs>
            <div className="relative w-full max-w-[250px]">
              <Input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border-[1px] border-gray-200 pl-10 pr-4 py-2 rounded-md"
                aria-label="Search lists or recipients"
              />
              {activeTab === "recipients" && (
                <Funnel className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      )}
      {(activeTab === "lists" ? listsData.length : recipientsData.length) ===
      0 ? (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4 gap-y-4">
          <img
            src="/images/noCredentials.png"
            alt="No data found"
            className="mb-4 max-w-[300px] w-full"
          />
          <h1 className="font-bold text-xl mb-2">
            {activeTab === "lists"
              ? "Let's Create Lists!"
              : "Let's Add Recipients!"}
          </h1>
          <p className="text-gray-600 text-center text-lg">
            {activeTab === "lists"
              ? "No lists are available. Start by creating a new list."
              : "No recipients are available. Start by adding new recipients."}
          </p>
          <Button className="flex items-center bg-white border-[1px] border-[#086956] text-[#086956] hover:bg-white py-2 rounded-sm px-4">
            <PlusCircle className="text-[#086956]" />
            {activeTab === "lists" ? "Create a List" : "Add Recipients"}
          </Button>
          <p className="underline cursor-pointer text-xl">Learn More</p>
        </div>
      ) : (
        <div className="px-4">
          <DynamicTable<Recipient | List>
            data={paginatedData}
            columns={
              (activeTab === "lists"
                ? columnsLists
                : columnsRecipients) as ColumnConfig<Recipient | List>[]
            }
            actionsColumn={actionsColumn}
            parentComponent="RecipientManagementDashboard"
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onSelectionChange={setSelectedRecipients}
            selectedIds={selectedRecipients}
            enableSelection={activeTab === "recipients"}
          />
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={
              activeTab === "lists" ? listsData.length : recipientsData.length
            }
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
}
