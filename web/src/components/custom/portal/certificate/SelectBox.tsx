import { FileBadge } from "lucide-react";

interface SelectBoxPrep{
    SelectItemName:string;
}

export default function SelectBox({SelectItemName}:SelectBoxPrep) {
  return (
    <div className="w-full bg-[#fafafa] border border-gray-200 rounded-md flex items-center px-6 py-4 min-h-[64px]">
      <div className="bg-gray-100 rounded-md p-3 flex items-center justify-center mr-4">
        <FileBadge className="w-6 h-6 text-gray-400" />
      </div>
      <span className="font-semibold text-gray-400 text-lg mr-2">
        Select {SelectItemName} Design
      </span>
      <span className="text-gray-300 text-base font-normal">Optional</span>
    </div>
  );
}