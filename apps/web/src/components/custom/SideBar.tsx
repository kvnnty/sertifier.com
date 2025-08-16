"use client";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { SIDEBAR_NAV_ITEMS } from "./constants/nav";

type SideBarProps = {
  onHoverChange?: (expanded: boolean) => void;
};

export default function SideBar({ onHoverChange }: SideBarProps) {
  const [openCollapsible, setOpenCollapsible] = React.useState<string | null>(null);
  const sidebarRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  React.useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;
    const handleMouseLeave = () => {
      setOpenCollapsible(null);
      if (onHoverChange) {
        onHoverChange(false);
      }
    };
    const handleMouseEnter = () => {
      if (onHoverChange) {
        onHoverChange(true);
      }
    };
    sidebar.addEventListener("mouseleave", handleMouseLeave);
    sidebar.addEventListener("mouseenter", handleMouseEnter);
    return () => {
      sidebar.removeEventListener("mouseleave", handleMouseLeave);
      sidebar.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [onHoverChange]);

  return (
    <aside ref={sidebarRef} className="h-screen group fixed px-2 left-0 top-0 z-40 flex flex-col justify-between transition-all duration-300 w-16 hover:w-72">
      <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col">
        <nav className="py-6 flex-1 flex flex-col">
          <div className="flex-1 flex flex-col gap-2">
            {SIDEBAR_NAV_ITEMS.map((item) => {
              // If item has children, render collapsible
              if (item.children && item.children.length > 0) {
                return (
                  <Collapsible
                    key={item.label}
                    open={openCollapsible === item.label}
                    onOpenChange={(open: boolean) => setOpenCollapsible(open ? item.label : null)}
                    className="group-hover:w-64">
                    <CollapsibleTrigger asChild>
                      <button className="flex items-center px-4 py-3 w-full rounded-lg transition-colors duration-700 text-gray-700 hover:bg-green-50 focus:outline-none">
                        <div className="w-full flex items-center gap-4">
                          <span className="transition-all">{item.icon}</span>
                          <span className="ml-2 text-base font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                            {item.label}
                          </span>
                        </div>
                        <ChevronDown size={20} />
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="pl-8 py-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className={`group/link flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-green-50 rounded-lg text-sm ${
                              pathname === child.href ? "bg-green-50 text-gray-700 hover:bg-green-50" : ""
                            }`}>
                            <span className="transition-all">{child.icon}</span>
                            <span>{child.label}</span>
                          </Link>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              }

              // Render simple link (leaf node)
              return (
                <Link
                  key={item.label}
                  href={item.href!}
                  className={`group/link flex items-center gap-4 px-4 py-3 rounded-lg duration-700 text-gray-700 hover:bg-green-50 group-hover:w-64 transition-all ${
                    pathname === item.href ? "bg-green-50" : ""
                  }`}>
                  <span className="transition-all">{item.icon}</span>
                  <span className="text-base font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
          <div>
            <Link
              href="/portal/user/profile/settings"
              className={`group/link flex items-center gap-4 px-4 py-3 rounded-lg duration-700 text-gray-700 hover:bg-green-50 group-hover:w-64 transition-all ${
                pathname === "/portal/user/settings" ? "bg-green-50" : ""
              }`}>
              <span className="transition-all">
                <Settings />
              </span>
              <span className="text-base font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Settings</span>
            </Link>
          </div>
        </nav>
      </div>
    </aside>
  );
}
