"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useState } from "react";

interface CostComponentProps {
  onRemove: () => void;
}

export const CostComponent = ({ onRemove }: CostComponentProps) => {
  const [costType, setCostType] = useState<string>("");

  return (
    <div className="mt-4 p-4 border border-gray-200 rounded-lg relative">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Cost</h3>
        <button
          onClick={onRemove}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={16} />
        </button>
      </div>

      <Select onValueChange={setCostType}>
        <SelectTrigger className="border-[#086956] focus:ring-[#086956] mb-2 w-[30%]">
          <SelectValue placeholder="Select cost type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
        </SelectContent>
      </Select>

      <p className="mt-2 text-sm text-gray-500">
        Indicate whether the event is free or requires a payment.
      </p>
    </div>
  );
};
