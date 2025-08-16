"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

interface LevelComponentProps {
  onRemove: () => void;
}

export const LevelComponent = ({ onRemove }: LevelComponentProps) => {
  const [selectedLevel, setSelectedLevel] = useState<string>("none");

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
  };

  const handleClearLevel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedLevel("none");
  };

  return (
    <div className="mt-4 p-4 border border-gray-200 rounded-lg relative">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-[#086956]">Level</h3>
        <button
          onClick={onRemove}
          className="text-gray-500 hover:text-gray-700"
        >
        <FaTrashAlt className="text-gray-500 hover:text-gray-700 cursor-pointer" />
        </button>
      </div>

      <div className="w-[30%] relative">
        <Select value={selectedLevel} onValueChange={handleLevelChange}>
          <SelectTrigger className="border-[#086956] focus:ring-[#086956] pr-8">
            <SelectValue placeholder="Select level" />
            {selectedLevel !== "none" && (
              <button
                onClick={handleClearLevel}
                className=" p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
                aria-label="Clear selection"
              >
                <X size={14} />
              </button>
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>{" "}
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="mt-2 text-sm text-gray-500">
        If there is no training or evaluation, please leave this field empty.
      </p>
    </div>
  );
};
