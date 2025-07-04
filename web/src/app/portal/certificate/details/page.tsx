"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
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

export default function CertificateDetailsPage() {
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

  const handleContentChange = (content: string) => {
    setEditorContent(content);
  };

  const handleTitleChange = (title: string) => {
    setCredentialTitle(title);
  };

  const handleAttributeSelect = (attribute: string) => {
    console.log("Selected Attribute:", attribute);
  };

  const handleAddOptionalField = (field: string) => {
    setActiveOptionalFields([...activeOptionalFields, field]);
    setAvailableOptionalFields(
      availableOptionalFields.filter((f) => f !== field)
    );
  };

  const handleRemoveOptionalField = (field: string) => {
    setActiveOptionalFields(activeOptionalFields.filter((f) => f !== field));
    setAvailableOptionalFields([...availableOptionalFields, field]);
    if (field === "Credential Type") {
      setCredentialType("");
    }
  };

  const handleCredentialTypeChange = (value: string) => {
    setCredentialType(value);
    console.log("Selected Credential Type:", value);
  };

  const renderOptionalFieldComponent = (field: string) => {
    switch (field) {
      case "Credential Type":
        return (
          <CredentialTypeComponent
            onRemove={() => handleRemoveOptionalField(field)}
            onChange={handleCredentialTypeChange}
          />
        );
      case "Duration":
        return (
          <DurationComponent
            onRemove={() => handleRemoveOptionalField(field)}
          />
        );
      case "Cost":
        return (
          <CostComponent onRemove={() => handleRemoveOptionalField(field)} />
        );
      case "Level":
        return (
          <LevelComponent onRemove={() => handleRemoveOptionalField(field)} />
        );
      case "Earning Criteria":
        return (
          <EarningCriteriaComponent
            onRemove={() => handleRemoveOptionalField(field)}
          />
        );
      case "Expiry Date":
        return (
          <ExpiryDateComponent
            onRemove={() => handleRemoveOptionalField(field)}
          />
        );
      case "Supporting Documents":
        return (
          <SupportingDocumentsComponent
            onRemove={() => handleRemoveOptionalField(field)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Topbar />
      <div className="min-h-screen bg-gray-100 p-6 font-global flex flex-col justify-center z-0">
        <div className="flex gap-6 justify-center">
          <div className="flex-1 max-w-4xl bg-white p-6 rounded-lg shadow-md">
            <div className="bg-white">
              <CredentialTitle
                onTitleChange={handleTitleChange}
                onAttributeSelect={handleAttributeSelect}
              />
              <h1 className="text-sm font-semibold mb-4">
                Credential Description
              </h1>
              <RichTextEditor
                value={editorContent}
                onChange={handleContentChange}
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
            onAddField={handleAddOptionalField}
          />
        </div>
      </div>
    </div>
  );
}

function Topbar() {
  return (
    <div className="flex items-center justify-between p-4 bg-white mb-6 sticky top-16 z-30">
      <h1 className="text-xl font-semibold text-[#086956]">
        Create New Detail
      </h1>
      <Button className="bg-[#086956] text-white hover:bg-[#065f4c]">
        <Save />
        <h1>Save & Continue</h1>
      </Button>
    </div>
  );
}
