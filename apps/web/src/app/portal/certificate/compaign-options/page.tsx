"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { useState } from "react";

export default function CompaignOptions() {
  const [isPublic, setIsPublic] = useState(true);

  
  return (
    <div className="min-h-screen">
      <div className="bg-white flex justify-between items-center h-20 border-b px-12 sticky top-20 z-50">
        <h1 className="text-gray-900 font-bold text-2xl">Compaign Options</h1>

        <Button className="rounded-md bg-teal-700 px-8 hover:bg-teal-800 duration-300">Continue</Button>
      </div>
      <div className="shadow-sm rounded-lg">
        <div>
          <h2>Compaign Title </h2>
          <Input type="text w-1/2 px-2" />
          <p>Give this compaign a name to easily find it later. Don't worry , recipients won't see this name.</p>
          <div className="space-y-3">
                <div className="flex items-center gap-6">
                  <Label htmlFor="campaign-privacy" className="text-md font-medium text-gray-700">
                    Campaign Privacy
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-gray-800" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Public campaigns can be discovered by others, while private campaigns are invitation-only</p>
                    </TooltipContent>
                  </Tooltip>
                  <Switch
                    id="campaign-privacy"
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                  />
                  <span className="text-sm text-gray-600">
                    {isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>
        </div>

      </div>
    </div>
  );
}
