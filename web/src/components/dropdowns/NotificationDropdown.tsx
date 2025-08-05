import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
export default function NotificationDropdown() {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="cursor-pointer size-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors">
            <Bell />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[360px]">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="min-h-[400px] flex flex-col">
            <div className="flex-1 grid place-content-center">
              <p className="text-center">You have no new notifications</p>
            </div>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-center text-sm text-gray-500">View all notifications</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
