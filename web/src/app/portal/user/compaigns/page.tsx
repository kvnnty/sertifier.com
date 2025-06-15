"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { FilterIcon, SearchIcon } from "lucide-react";
import CredentialCard from "@/components/custom/CredentialCard";
import { useState, useEffect } from "react";
import Pagination from "@/components/custom/Pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EmptyCompaign from "@/components/custom/portal/user/EmptyCompaign";

const credentials = [
  {
    id: 1,
    title: "Third Credential",
    creationDate: "01 August, 2024",
    recipientsCount: 5,
    details: "Details for the third credential.",
    status: "draft",
  },
  {
    id: 2,
    title: "Marketing Campaign",
    creationDate: "02 August, 2024",
    recipientsCount: 10,
    details: "Marketing campaign details.",
    status: "scheduled",
  },
  {
    id: 3,
    title: "Training Certificate",
    creationDate: "03 August, 2024",
    recipientsCount: 15,
    details: "Training certificate details.",
    status: "sent",
  },
  {
    id: 4,
    title: "Workshop Badge",
    creationDate: "04 August, 2024",
    recipientsCount: 8,
    details: "Workshop badge details.",
    status: "draft",
  },
  {
    id: 5,
    title: "Conference Pass",
    creationDate: "05 August, 2024",
    recipientsCount: 20,
    details: "Conference pass details.",
    status: "scheduled",
  },
  {
    id: 6,
    title: "Leadership Summit Certificate",
    creationDate: "06 August, 2024",
    recipientsCount: 25,
    details: "Certificate for Leadership Summit participants.",
    status: "draft",
  },
  {
    id: 7,
    title: "Tech Workshop Badge",
    creationDate: "07 August, 2024",
    recipientsCount: 30,
    details: "Digital badges for tech workshop attendees.",
    status: "scheduled",
  },
  {
    id: 8,
    title: "Annual Conference Pass",
    creationDate: "08 August, 2024",
    recipientsCount: 50,
    details: "Access passes for annual conference.",
    status: "sent",
  },
  {
    id: 9,
    title: "Product Launch Certificate",
    creationDate: "09 August, 2024",
    recipientsCount: 15,
    details: "Certificates for product launch team.",
    status: "draft",
  },
  {
    id: 10,
    title: "Sales Training Badge",
    creationDate: "10 August, 2024",
    recipientsCount: 40,
    details: "Training completion badges for sales team.",
    status: "scheduled",
  },
  {
    id: 11,
    title: "Customer Success Certificate",
    creationDate: "11 August, 2024",
    recipientsCount: 35,
    details: "Certificates for customer success team.",
    status: "sent",
  },
  {
    id: 12,
    title: "Hackathon Winner Badge",
    creationDate: "12 August, 2024",
    recipientsCount: 10,
    details: "Winner badges for hackathon participants.",
    status: "draft",
  },
  {
    id: 13,
    title: "Innovation Summit Pass",
    creationDate: "13 August, 2024",
    recipientsCount: 45,
    details: "Access passes for innovation summit.",
    status: "scheduled",
  },
  {
    id: 14,
    title: "Developer Workshop Certificate",
    creationDate: "14 August, 2024",
    recipientsCount: 28,
    details: "Certificates for developer workshop.",
    status: "sent",
  },
  {
    id: 15,
    title: "Design Sprint Badge",
    creationDate: "15 August, 2024",
    recipientsCount: 22,
    details: "Badges for design sprint participants.",
    status: "draft",
  },
  {
    id: 16,
    title: "Product Management Certificate",
    creationDate: "16 August, 2024",
    recipientsCount: 18,
    details: "Certificates for product management course.",
    status: "scheduled",
  },
  {
    id: 17,
    title: "UX Workshop Badge",
    creationDate: "17 August, 2024",
    recipientsCount: 32,
    details: "Badges for UX workshop completion.",
    status: "sent",
  },
  {
    id: 18,
    title: "Agile Training Certificate",
    creationDate: "18 August, 2024",
    recipientsCount: 27,
    details: "Certificates for agile methodology training.",
    status: "draft",
  },
  {
    id: 19,
    title: "Data Science Summit Pass",
    creationDate: "19 August, 2024",
    recipientsCount: 55,
    details: "Access passes for data science summit.",
    status: "scheduled",
  },
  {
    id: 20,
    title: "Cloud Computing Badge",
    creationDate: "20 August, 2024",
    recipientsCount: 38,
    details: "Badges for cloud computing workshop.",
    status: "sent",
  },
];

export default function Campaigns() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("draft");
  const itemsPerPage = 5;

  // Reset pagination when search term or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, activeTab]);

  // Filter credentials based on search term, status, and active tab
  const filteredCredentials = credentials.filter((credential) => {
    const matchesSearch =
      credential.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credential.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus.length === 0 || selectedStatus.includes(credential.status);
    const matchesTab = activeTab === "all" || credential.status === activeTab;
    return matchesSearch && matchesStatus && matchesTab;
  });

  const totalPages = Math.ceil(filteredCredentials.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCredentials.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleStatusFilter = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  return (
    <Tabs defaultValue="all" onValueChange={handleTabChange}>
      <div className="">
        <div className="sticky top-[85px] z-40 border-b border-gray-200 bg-white h-[90px] flex items-center justify-between px-8">
          <Button className="hover:bg-teal-700 bg-teal-600 rounded-sm" size="sm">
            Create New Campaign
          </Button>
          <TabsList className="">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <FilterIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuCheckboxItem
                  checked={selectedStatus.includes("draft")}
                  onCheckedChange={() => handleStatusFilter("draft")}
                >
                  Draft
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedStatus.includes("scheduled")}
                  onCheckedChange={() => handleStatusFilter("scheduled")}
                >
                  Scheduled
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedStatus.includes("sent")}
                  onCheckedChange={() => handleStatusFilter("sent")}
                >
                  Sent
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <TabsContent value="all" className="grid grid-cols-4 px-6 py-10 gap-4">
          {currentItems.length > 0 ? (
            currentItems.map((credential) => (
              <CredentialCard
                key={credential.id}
                title={credential.title}
                creationDate={credential.creationDate}
                recipientsCount={credential.recipientsCount}
                details={credential.details}
              />
            ))
          ) : (
            <div className="col-span-4 flex justify-center items-center h-full">
              <EmptyCompaign
                title="No Campaigns Found"
                description="It looks like there are no campaigns that match your search or filter criteria. Try adjusting your filters or search terms."
                buttonText="Create New Campaign"
                onButtonClick={() =>
                  console.log("Create New Campaign from All Empty State")
                }
              />
            </div>
          )}
        </TabsContent>
        <TabsContent
          value="draft"
          className="grid grid-cols-4 px-6 py-10 gap-4"
        >
          {currentItems.length > 0 ? (
            currentItems.map((credential) => (
              <CredentialCard
                key={credential.id}
                title={credential.title}
                creationDate={credential.creationDate}
                recipientsCount={credential.recipientsCount}
                details={credential.details}
              />
            ))
          ) : (
            <div className="col-span-4 flex justify-center items-center h-full">
              <EmptyCompaign
                title="No Draft Campaigns"
                description="It looks like you don't have any draft campaigns yet. Get started by creating a new campaign."
                buttonText="Create New Campaign"
                onButtonClick={() =>
                  console.log("Create New Campaign from Draft Empty State")
                }
              />
            </div>
          )}
        </TabsContent>
        <TabsContent
          value="scheduled"
          className="grid grid-cols-4 px-6 py-10 gap-4"
        >
          {currentItems.length > 0 ? (
            currentItems.map((credential) => (
              <CredentialCard
                key={credential.id}
                title={credential.title}
                creationDate={credential.creationDate}
                recipientsCount={credential.recipientsCount}
                details={credential.details}
              />
            ))
          ) : (
            <div className="col-span-4 flex justify-center items-center h-full">
              <EmptyCompaign
                title="No Scheduled Campaigns"
                description="There are no campaigns scheduled for future sending. Schedule a new campaign to appear here."
                buttonText="Create New Campaign"
                onButtonClick={() =>
                  console.log("Create New Campaign from Scheduled Empty State")
                }
              />
            </div>
          )}
        </TabsContent>
        <TabsContent value="sent" className="grid grid-cols-4 px-6 py-10 gap-4">
          {currentItems.length > 0 ? (
            currentItems.map((credential) => (
              <CredentialCard
                key={credential.id}
                title={credential.title}
                creationDate={credential.creationDate}
                recipientsCount={credential.recipientsCount}
                details={credential.details}
              />
            ))
          ) : (
            <div className="col-span-4 flex justify-center items-center h-full">
              <EmptyCompaign
                title="No Sent Campaigns"
                description="You haven't sent any campaigns yet. Once you send a campaign, it will appear here."
                buttonText="Create New Campaign"
                onButtonClick={() =>
                  console.log("Create New Campaign from Sent Empty State")
                }
              />
            </div>
          )}
        </TabsContent>
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
    </Tabs>
  );
}
