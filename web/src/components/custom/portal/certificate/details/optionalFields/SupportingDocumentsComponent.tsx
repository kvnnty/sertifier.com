"use client";

import { Button } from "@/components/ui/button";
import { FileInput } from "@/components/ui/fileInput";
import { X } from "lucide-react";

interface SupportingDocumentsComponentProps {
  onRemove: () => void;
}

export const SupportingDocumentsComponent = ({ onRemove }: SupportingDocumentsComponentProps) => {
  return (
    <div className="mt-4 p-4 border border-gray-200 rounded-lg relative">
      <h3 className="font-medium mb-2">Supporting Documents</h3>
      <div className="space-y-2">
        {/* <FileInput multiple accept=".pdf,.doc,.docx">
          <Button variant="outline">Upload Documents</Button>
        </FileInput> */}
        <p className="text-sm text-muted-foreground">
          PDF, DOC, DOCX (Max 10MB each)
        </p>
      </div>
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <X size={16} />
      </button>
    </div>
  );
};