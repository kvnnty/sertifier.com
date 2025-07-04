"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface CredentialTypeComponentProps {
  onRemove: () => void;
  onChange: (value: string) => void;
}

const CredentialTypeComponent = ({
  onRemove,
  onChange,
}: CredentialTypeComponentProps) => {
  return (
    <div className="mt-4 p-4 border border-gray-200 rounded-sm relative">
      <h3 className="font-medium mb-2">Credential Type</h3>
      <Select onValueChange={onChange}>
        <SelectTrigger className="w-full border-[1px] border-[#086956]">
          <SelectValue placeholder="Select Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="certificate">Certificate</SelectItem>
          <SelectItem value="badge">Badge</SelectItem>
          <SelectItem value="diploma">Diploma</SelectItem>
        </SelectContent>
      </Select>

      <h3 className="my-2 text-[#A0A0A0] text-sm">
        Select the type of achievement this credential represents.
      </h3>
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default CredentialTypeComponent;
