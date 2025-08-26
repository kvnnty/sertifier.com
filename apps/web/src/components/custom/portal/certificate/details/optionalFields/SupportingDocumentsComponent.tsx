"use client";

import { useState } from "react";
import { PlusCircle, X } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaTrashAlt } from "react-icons/fa";

interface Document {
  title: string;
  url: string;
  attribute: string;
}

interface SupportingDocumentsComponentProps {
  onRemove: () => void;
}

export const SupportingDocumentsComponent = ({
  onRemove,
}: SupportingDocumentsComponentProps) => {
  const [documents, setDocuments] = useState<Document[]>([
    { title: "", url: "", attribute: "" },
  ]);

  const addDocument = () => {
    if (documents.length < 5) {
      setDocuments([...documents, { title: "", url: "", attribute: "" }]);
    }
  };

  const removeDocument = (index: number) => {
    if (documents.length > 1) {
      const newDocuments = [...documents];
      newDocuments.splice(index, 1);
      setDocuments(newDocuments);
    }
  };

  const handleTitleChange = (index: number, value: string) => {
    const newDocuments = [...documents];
    newDocuments[index].title = value;
    setDocuments(newDocuments);
  };

  const handleUrlChange = (index: number, value: string) => {
    const newDocuments = [...documents];
    newDocuments[index].url = value;
    setDocuments(newDocuments);
  };

  const handleAttributeChange = (index: number, value: string) => {
    const newDocuments = [...documents];
    newDocuments[index].attribute = value;
    setDocuments(newDocuments);
  };

  return (
    <div className="mt-4 p-4 border border-gray-200 rounded-lg relative">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <FaTrashAlt className="text-gray-500 hover:text-gray-700 cursor-pointer" />
      </button>

      <h3 className="font-medium mb-4">Supporting Documentation</h3>

      {documents.map((doc, index) => (
        <div key={index} className="mb-6">
          <hr className="my-3" />
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Document Title</h4>
            {index > 0 && (
              <FaTrashAlt
                onClick={() => removeDocument(index)}
                className="text-black cursor-pointer hover:text-red-500"
              />
            )}
          </div>

          <div className="space-y-3">
            <Input
              placeholder="Document Title"
              value={doc.title}
              onChange={(e) => handleTitleChange(index, e.target.value)}
              className="border-[#086956] focus-visible:ring-[#086956] w-[40%] rounded-[3px]"
            />

            <div className="flex gap-2">
              <Input
                placeholder="https://link.to.document"
                value={doc.url}
                onChange={(e) => handleUrlChange(index, e.target.value)}
                className="flex-1 border-[#086956] focus-visible:ring-[#086956]"
              />
              <Select
                value={doc.attribute}
                onValueChange={(value) => handleAttributeChange(index, value)}
              >
                <SelectTrigger className="w-[180px] border-[#086956] focus:ring-[#086956]">
                  <SelectValue placeholder="Attributes" />
                </SelectTrigger>
                <SelectContent>
                  <h1 className="text-[#187361] pl-2 text-sm font-medium pt-2">
                    RECIPIENT
                  </h1>
                  <SelectItem value="Recipient Name">Recipient Name</SelectItem>
                  <SelectItem value="Recipient E-Mail">
                    Recipient E-Mail
                  </SelectItem>
                  <hr className="my-1" />
                  <h1 className="text-[#187361] pl-2 text-sm font-medium pt-2">
                    CREDENTIAL
                  </h1>
                  <SelectItem value="Credential ID">Credential ID</SelectItem>
                  <SelectItem value="Issue Date">Issue Date</SelectItem>
                  <SelectItem value="Credential Name">
                    Credential Name
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="mt-2 text-sm text-gray-600">
            You can add an attribute to use unique links for each recipient.
          </p>
        </div>
      ))}

      {documents.length < 5 && (
        <div
          onClick={addDocument}
          className="text-[#086956] border-[#086956]  underline flex items-center gap-x-2 cursor-pointer"
        >
          <PlusCircle className="" />
          Add Another Document
        </div>
      )}

      <p className="mt-4 text-sm text-gray-600">
        Provide links to supporting documents that validate this credential
        (e.g., project work, portfolios, research papers).
      </p>
    </div>
  );
};
