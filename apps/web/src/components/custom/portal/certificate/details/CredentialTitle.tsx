"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CredentialTitleProps {
  onTitleChange: (value: string) => void;
  onAttributeSelect: (value: string) => void;
}

export const CredentialTitle = ({
  onTitleChange,
  onAttributeSelect,
}: CredentialTitleProps) => {
  return (
    <div className="mb-6 flex space-x-4 items-center">
      <div className="mb-4 w-[80%]">
        <Label htmlFor="credential-title" className="block mb-2 font-medium">
          Credential Title
        </Label>
        <Input
          id="credential-title"
          placeholder="Enter credential name"
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full border border-gray-300 p-2"
        />
      </div>

      <div className="w-[20%]">
        <Select onValueChange={onAttributeSelect}>
          <SelectTrigger className="w-full border border-gray-300 p-2">
            <SelectValue placeholder="Attributes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              value="ISSUER"
              disabled
              className="font-bold text-[#086956]"
            >
              ISSUER
            </SelectItem>
            <SelectItem value="Issuer Name">Issuer Name</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
