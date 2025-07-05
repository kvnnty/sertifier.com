
"use client";

import { Clock, Tag, Layers, List, Calendar, Paperclip } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface OptionalFieldsSidebarProps {
  availableFields: string[];
  onAddField: (field: string) => void;
}


export const OptionalFieldsSidebar = ({
  availableFields,
  onAddField,
}: OptionalFieldsSidebarProps) => {
  const fieldIcons = {
    "Credential Type": <Layers className="w-4 h-4 mr-2" />,
    Duration: <Clock className="w-4 h-4 mr-2" />,
    Cost: <Tag className="w-4 h-4 mr-2" />,
    Level: <Layers className="w-4 h-4 mr-2" />,
    "Earning Criteria": <List className="w-4 h-4 mr-2" />,
    "Expiry Date": <Calendar className="w-4 h-4 mr-2" />,
    "Supporting Documents": <Paperclip className="w-4 h-4 mr-2" />,
  };

  const fieldTooltips = {
    "Credential Type": "Select the type of credential for this certificate.",
    Duration: "Specify the duration of the certificate validity.",
    Cost: "Indicate the cost associated with obtaining this certificate.",
    Level: "Define the skill level required for this certificate.",
    "Earning Criteria": "Outline the criteria needed to earn this certificate.",
    "Expiry Date": "Set the expiration date for this certificate.",
    "Supporting Documents": "Upload any supporting documents for verification.",
  };

  return (
    <div className="w-64 bg-white p-4 rounded-lg shadow-md h-fit">
      <h2 className="font-medium mb-4">Add Optional Fields</h2>
      <div className="space-y-4">
        {availableFields.map((field) => (
          <div key={field}>
            <div
              className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
              onClick={() => onAddField(field)}
            >
              {fieldIcons[field as keyof typeof fieldIcons]}
              <span className="text-sm flex-1">{field}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 cursor-pointer text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-black text-white text-sm px-3 py-2 rounded max-w-[250px]"
                  >
                    {fieldTooltips[field as keyof typeof fieldTooltips]}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <hr className="my-2 border-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
};