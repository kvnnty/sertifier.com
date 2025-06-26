"use client";

import { Bell, ChevronDownIcon, ClockIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { HelpCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TopBar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <header className="sticky top-0 z-50 w-full flex items-center justify-end px-8 py-4 bg-white border-b border-gray-100">
      <div className="flex items-center gap-10">
        {/* Status Box */}
        <div className="flex items-center bg-orange-50 rounded-md px-4 py-2 gap-3">
          <span className="text-orange-400">
            {/* Clock Icon */}
            <ClockIcon />
          </span>
          <span className="text-sm font-medium text-gray-800">
            5 Recipients Remaining
          </span>
          <Button className="ml-2 bg-orange-300 hover:bg-orange-400 text-white font-semibold px-4 py-1 rounded transition text-sm">
            Upgrade
          </Button>
        </div>

        <Bell />
        <HelpCircle />

        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback className="text-xl bg-gray-100 me-2">
            M
          </AvatarFallback>
        </Avatar>

        {/* Organization Name and Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors">
              <span className="text-base font-medium text-gray-800">
                My Organization
              </span>
              <ChevronDownIcon className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
            <DropdownMenuLabel>
              <div className="px-2">
                <p className="text-sm font-medium text-gray-900">
                  My Organization
                </p>
                <p className="text-xs text-gray-500">admin@myorg.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Organization Settings</DropdownMenuItem>
            <DropdownMenuItem>Billing & Plans</DropdownMenuItem>
            <DropdownMenuItem>Team Members</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
