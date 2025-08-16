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
import { FaTrashAlt } from "react-icons/fa";

interface DurationComponentProps {
  onRemove: () => void;
}

export const DurationComponent = ({ onRemove }: DurationComponentProps) => {
  return (
    <div className="mt-4 p-4 border border-gray-200 rounded-lg relative">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-[#086956]">Duration</h3>
        <button
          onClick={onRemove}
          className="text-gray-500 hover:text-gray-700"
        >
        <FaTrashAlt className="text-gray-500 hover:text-gray-700 cursor-pointer" />
        </button>
      </div>

      <div className="flex gap-2">
        <div className="flex">
          <Input
            type="number"
            placeholder="0"
            className="border-[#086956] focus-visible:ring-[#086956]"
          />
        </div>
        <div className="">
          <Select>
            <SelectTrigger className="border-[#086956] focus:ring-[#086956]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minutes">Minutes</SelectItem>
              <SelectItem value="hours">Hours</SelectItem>
              <SelectItem value="days">Days</SelectItem>
              <SelectItem value="weeks">Weeks</SelectItem>
              <SelectItem value="months">Months</SelectItem>
              <SelectItem value="years">Years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="mt-2 text-sm text-gray-500">
        Specify the total duration of the event, including all sessions and
        breaks. The duration can be specified in hours, days, or weeks.
      </p>
    </div>
  );
};
