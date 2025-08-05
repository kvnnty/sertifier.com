"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axiosClient from "@/config/axios.config";
import { useOrganizationManager } from "@/hooks/useOrganizationManager";
import { useAuth } from "@/lib/store/features/auth/auth.selector";
import { logout } from "@/lib/store/features/auth/auth.slice";
import { useOrganization } from "@/lib/store/features/organization/organization.selector";
import clsx from "clsx";
import { ArrowRight, ChevronDownIcon, LogOut, Plus, Users } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import Spinner from "../loaders/Spinner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function ProfileDropdown() {
  const { currentUser } = useAuth();
  const { currentOrganization, organizations } = useOrganization();
  const { selectOrganization } = useOrganizationManager();
  const [logoutPending, setLogoutPending] = useState(false);

  const dispatch = useDispatch();

  const handleLogout = async () => {
    setLogoutPending(true);
    await axiosClient
      .post("/auth/logout")
      .then(() => {
        toast("Signed out!");
        localStorage.clear();
        dispatch(logout());
      })
      .catch((error: any) => {
        toast.error(error.response.data.message || "Something went wrong logging you out", {
          description: "Please try again later, if issue persists please contact support.",
        });
      })
      .finally(() => {
        setLogoutPending(false);
      });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer border flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors">
          <Avatar>
            <AvatarImage src={currentOrganization?.logo} alt={`${currentOrganization?.name}'s logo`} />
            <AvatarFallback className="text-xl bg-gray-100">{currentOrganization?.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-gray-800 capitalize text-sm">{currentOrganization?.name}</span>
          <ChevronDownIcon className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[360px] -translate-x-10">
        <DropdownMenuLabel>
          <div className="px-2 flex flex-col items-center">
            <Avatar className="size-20">
              <AvatarImage src={currentUser?.profileImage} alt={`${currentUser?.fullName}'s profile image`} />
              <AvatarFallback className="!text-black">
                {currentUser?.firstName.charAt(0).toUpperCase()} {currentUser?.lastName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-medium text-gray-900 capitalize mt-2 text-lg whitespace-nowrap overflow-hidden text-ellipsis">{currentUser?.fullName}</h3>
            <p className="text-sm text-gray-500">{currentUser?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="p-2 space-y-2">
          <p className="text-gray-500 text-sm">Your organizations</p>
          <div className="rounded max-h-[260px] overflow-y-auto hide-scrollbar">
            {organizations.map((org) => (
              <button
                title={org.name}
                onClick={() => selectOrganization(org)}
                key={org._id}
                className={clsx(
                  "cursor-pointer capitalize flex items-center gap-2 rounded-md px-3 py-3 w-full transition-all hover:bg-gray-50 group",
                  org._id === currentOrganization?._id && "bg-black text-white hover:!bg-black/80 hover:!text-white"
                )}>
                <div className="w-full flex items-center gap-3 whitespace-nowrap overflow-hidden">
                  <Avatar>
                    <AvatarImage src={org.logo} alt={org.name} />
                    <AvatarFallback className="!text-black">{org.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <p className="overflow-hidden text-ellipsis text-sm">{org.name}</p>
                    <p className={clsx("text-xs text-gray-500", org._id === currentOrganization?._id && "text-white ")}>
                      {org.createdBy === currentUser?._id && "Owner"}
                    </p>
                  </div>
                </div>
                <ArrowRight className="invisible opacity-0 group-hover:visible group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Plus />
          Create Organization
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Users />
          Organization Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <button
          disabled={logoutPending}
          onClick={handleLogout}
          className="relative flex select-none items-center rounded-lg h-11 p-4 outline-none w-full gap-3 text-[#D9000B] hover:bg-[#D9000B]/10 cursor-pointer">
          <LogOut />
          Sign out
          {logoutPending && <Spinner color="#000" />}
        </button>{" "}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
