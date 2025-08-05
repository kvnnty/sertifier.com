"use client";

import { ClockIcon } from "lucide-react";
import NotificationDropdown from "../dropdowns/NotificationDropdown";
import ProfileDropdown from "../dropdowns/ProfileDropdown";
import { Button } from "../ui/button";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-50 w-full flex items-center justify-end px-8 py-3 bg-white border-b border-gray-100">
      <div className="flex items-center gap-5">
        {/* Status Box */}
        <div className="flex items-center bg-orange-50 rounded-md px-4 py-2 gap-3">
          <span className="text-orange-400">
            {/* Clock Icon */}
            <ClockIcon />
          </span>
          <span className="text-sm font-medium text-gray-800">5 Recipients Remaining</span>
          <Button className="ml-2 bg-orange-300 hover:bg-orange-400 text-white font-semibold px-4 py-1 rounded transition text-sm">Upgrade</Button>
        </div>

        <NotificationDropdown />
        <ProfileDropdown />
      </div>
    </header>
  );
}
