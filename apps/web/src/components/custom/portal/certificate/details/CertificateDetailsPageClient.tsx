"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Edit,
  CheckCircle,
  Check,
  Loader,
  PlusCircle,
  Funnel,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { mockDetailsData } from "@/lib/mock/mockDetailsData";
import { ColumnConfig } from "@/components/custom/DynamicTable";
import DynamicTable from "@/components/custom/DynamicTable";
import CustomPagination from "@/components/custom/portal/user/Pagination";
import { CredentialTitle } from "@/components/custom/portal/certificate/details/CredentialTitle";
import RichTextEditor from "@/components/custom/RichTextEditor";
import Skills from "@/components/custom/portal/certificate/details/Skills";
import { OptionalFieldsSidebar } from "@/components/custom/portal/certificate/details/optionalFields/OptionalFieldsSidebar";
import CredentialTypeComponent from "@/components/custom/portal/certificate/details/optionalFields/CredentialTypeComponent";
import { DurationComponent } from "@/components/custom/portal/certificate/details/optionalFields/DurationComponent";
import { CostComponent } from "@/components/custom/portal/certificate/details/optionalFields/CostComponent";
import { LevelComponent } from "@/components/custom/portal/certificate/details/optionalFields/LevelComponent";
import { EarningCriteriaComponent } from "@/components/custom/portal/certificate/details/optionalFields/EarningCriteriaComponent";
import { ExpiryDateComponent } from "@/components/custom/portal/certificate/details/optionalFields/ExpiryDateComponent";
import { SupportingDocumentsComponent } from "@/components/custom/portal/certificate/details/optionalFields/SupportingDocumentsComponent";
import { Save } from "lucide-react";
import { FaTrashAlt } from "react-icons/fa";

interface Detail {
  id: string;
  title: string;
  description: string;
  status: number;
  createDate: string;
}

export default function CertificateDetailsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [credentialTitle, setCredentialTitle] = useState("");
  const [credentialType, setCredentialType] = useState("");
  const [activeOptionalFields, setActiveOptionalFields] = useState<string[]>(
    []
  );
  const [availableOptionalFields, setAvailableOptionalFields] = useState([
    "Credential Type",
    "Duration",
    "Cost",
    "Level",
    "Earning Criteria",
    "Expiry Date",
    "Supporting Documents",
  ]);
  const itemsPerPage = 5;
  const [showCreateView, setShowCreateView] = useState(false);

  const detailsData = mockDetailsData.data.items.map((item) => ({
    id: item.detail.id,
    title: item.detail.title,
    description: item.detail.description,
    status: item.detail.status,
    createDate: item.detail.createDate,
  }));

  const stableDetailsData = JSON.stringify(detailsData);

  useEffect(() => {
    const detailId = searchParams.get("detailId");
    if (detailId) {
      setSelectedDetailId(detailId);
    } else if (detailsData.length === 0) {
      setShowCreateView(true);
    } else if (!selectedDetailId) {
      setSelectedDetailId(detailsData[0].id);
    }
  }, [searchParams, stableDetailsData]);

  const handleSelectDetail = useCallback(
    (id: string) => {
      setSelectedDetailId((prevId) => {
        if (detailsData.length > 1 || id !== prevId) {
          return id;
        }
        return prevId;
      });
    },
    [detailsData.length]
  );

  const filteredData = detailsData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const selectedDetail = selectedDetailId
    ? detailsData.find((item) => item.id === selectedDetailId)
    : null;

  const columns: ColumnConfig<Detail>[] = [
    {
      key: "title",
      label: "NAME",
      sortable: true,
      render: (item) => (
        <div className="flex items-center truncate max-w-[180px]">
          <div className="mr-2 flex items-center justify-center h-5 w-5">
            {selectedDetailId === item.id && (
              <div className="h-5 w-5 rounded-full bg-[#086956] flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          <span className="truncate">{item.title}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      sortable: true,
      render: (item) => (
        <div className="flex items-center space-x-2">
          <Loader size={20} />
          <span
            className={item.status === 1 ? "text-[#086956]" : "text-gray-500"}
          >
            {item.status === 1 ? "Ready" : "Inactive"}
          </span>
        </div>
      ),
    },
    {
      key: "description",
      label: "DESCRIPTION",
      sortable: true,
      render: (item) => (
        <div className="truncate max-w-[200px]">{item.description}</div>
      ),
    },
    {
      key: "createDate",
      label: "DATE CREATED",
      sortable: true,
      format: (value) =>
        new Date(value)
          .toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .replace(/\//g, "."),
    },
  ];

  const actionsColumn = {
    label: "",
    render: (item: Detail) => (
      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          variant="ghost"
          size="sm"
          aria-label="View"
          className="h-8 hover:bg-gray-100 border-[1.5px] border-gray-400 px-10 rounded-sm cursor-pointer"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Edit"
          className="h-8 p-0 hover:bg-gray-100 rounded-sm border-[1.5px] border-gray-400 px-10 cursor-pointer"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          aria-label="Select"
          className="h-8  bg-[#086351] hover:bg-[#086351] cursor-pointer border-[1.5px] border-[#086351] px-10 rounded-sm"
          onClick={() => handleSelectDetail(item.id)}
          disabled={detailsData.length === 1 && selectedDetailId === item.id}
        >
          <CheckCircle
            className={`h-4 w-4 ${
              selectedDetailId === item.id ? "text-white" : "text-white"
            }`}
          />
        </Button>
      </div>
    ),
  };

  const handleCreateNewDetail = () => {
    setSelectedDetailId(null);
    setShowCreateView(true);
  };

  if (showCreateView || detailsData.length === 0) {
    return (
      <div>
        <DetailCreationTopBar />
        <div className="min-h-screen bg-gray-100 p-6 font-global flex flex-col justify-center z-0">
          <div className="flex gap-6 justify-center">
            <div className="flex-1 max-w-4xl bg-white p-6 rounded-lg ">
              <div className="bg-white">
                <CredentialTitle
                  onTitleChange={(title) => setCredentialTitle(title)}
                  onAttributeSelect={() => {}}
                />
                <h1 className="text-sm font-semibold mb-4">
                  Credential Description
                </h1>
                <RichTextEditor
                  value={editorContent}
                  onChange={(content) => setEditorContent(content)}
                  attributesShown={true}
                />
                <Skills />
              </div>
              <div>
                {activeOptionalFields.map((field) => (
                  <div key={field} className="w-full">
                    {renderOptionalFieldComponent(field)}
                  </div>
                ))}
              </div>
            </div>
            <OptionalFieldsSidebar
              availableFields={availableOptionalFields}
              onAddField={(field) => {
                setActiveOptionalFields([...activeOptionalFields, field]);
                setAvailableOptionalFields(
                  availableOptionalFields.filter((f) => f !== field)
                );
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-global mx-10">
      <div className="p-4 sticky top-16 z-30">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-[#086956]">Details</h1>
          <div className="flex items-center space-x-4">
            <Button
              className="border-[1.5px] border-[#086956] text-[#086956] hover:bg-transparent bg-transparent p-3 px-5 rounded-sm cursor-pointer flex items-center"
              onClick={handleCreateNewDetail}
            >
              <PlusCircle />
              Create New Detail
            </Button>
            <div className="border border-gray-200 inline-flex items-center justify-center p-2 rounded-sm">
              <Funnel size={20} />
            </div>{" "}
            <Input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-[250px] pl-4 pr-4 py-2 border-[1.5px] border-gray-400 rounded-sm"
            />
            <Button className="bg-[#086956] text-white hover:bg-[#065f4c] px-5 rounded-sm cursor-pointer">
              Continue
            </Button>
          </div>
        </div>
      </div>
      {selectedDetail && (
        <div className="mt-4 flex justify-between border border-gray-200 items-center p-4 bg-white my-5">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-medium">{selectedDetail.title}</span>
            <span className="text-sm text-gray-500">selected</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <FaTrashAlt className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <div className="p-4">
        <DynamicTable<Detail>
          data={paginatedData}
          columns={columns}
          actionsColumn={actionsColumn}
          parentComponent="CertificateDetailsPage"
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onSelectionChange={(ids) => {
            const id = ids.values().next().value as string;
            handleSelectDetail(id);
          }}
          selectedIds={
            selectedDetailId ? new Set([selectedDetailId]) : new Set()
          }
          enableSelection={true}
        />
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );

  function renderOptionalFieldComponent(field: string) {
    switch (field) {
      case "Credential Type":
        return (
          <CredentialTypeComponent
            onRemove={() => {
              setActiveOptionalFields(
                activeOptionalFields.filter((f) => f !== field)
              );
              setAvailableOptionalFields([...availableOptionalFields, field]);
              setCredentialType("");
            }}
            onChange={(value) => setCredentialType(value)}
          />
        );
      case "Duration":
        return (
          <DurationComponent
            onRemove={() => {
              setActiveOptionalFields(
                activeOptionalFields.filter((f) => f !== field)
              );
              setAvailableOptionalFields([...availableOptionalFields, field]);
            }}
          />
        );
      case "Cost":
        return (
          <CostComponent
            onRemove={() => {
              setActiveOptionalFields(
                activeOptionalFields.filter((f) => f !== field)
              );
              setAvailableOptionalFields([...availableOptionalFields, field]);
            }}
          />
        );
      case "Level":
        return (
          <LevelComponent
            onRemove={() => {
              setActiveOptionalFields(
                activeOptionalFields.filter((f) => f !== field)
              );
              setAvailableOptionalFields([...availableOptionalFields, field]);
            }}
          />
        );
      case "Earning Criteria":
        return (
          <EarningCriteriaComponent
            onRemove={() => {
              setActiveOptionalFields(
                activeOptionalFields.filter((f) => f !== field)
              );
              setAvailableOptionalFields([...availableOptionalFields, field]);
            }}
          />
        );
      case "Expiry Date":
        return (
          <ExpiryDateComponent
            onRemove={() => {
              setActiveOptionalFields(
                activeOptionalFields.filter((f) => f !== field)
              );
              setAvailableOptionalFields([...availableOptionalFields, field]);
            }}
          />
        );
      case "Supporting Documents":
        return (
          <SupportingDocumentsComponent
            onRemove={() => {
              setActiveOptionalFields(
                activeOptionalFields.filter((f) => f !== field)
              );
              setAvailableOptionalFields([...availableOptionalFields, field]);
            }}
          />
        );
      default:
        return null;
    }
  }
}

function DetailCreationTopBar() {
  return (
    <div className="flex items-center justify-between p-4 bg-white mb-6 sticky top-20 z-30">
      <h1 className="text-xl font-semibold text-[#086956]">
        Create New Detail
      </h1>
      <Button className="bg-[#086956] text-white hover:bg-[#065f4c] cursor-pointer">
        <Save className="mr-2 h-4 w-4" />
        Save & Continue
      </Button>
    </div>
  );
}
