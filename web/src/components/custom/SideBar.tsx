"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Megaphone,
  Palette,
  BookOpen,
  Mail,
  ScanQrCode,
  Network,
  LayoutPanelTop,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="3" width="18" height="18" rx="4" fill="#14796A" />
        <path
          d="M8 12h8M8 16h4"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    href: "/portal/user",
  },
  {
    label: "Send Certificates",
    icon: (
      <svg className="w-7 h-7" fill="#14796A" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <path
          d="M12 8v8M8 12h8"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    href: "/portal/certificate",
  },
  {
    label: "Campaigns",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M2 12l10-7 10 7-10 7-10-7z" />
        <path d="M2 12l10 7 10-7" />
      </svg>
    ),
    href: "/portal/user/compaigns",
  },
  {
    label: "Verification Page",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12l2 2 4-4" />
      </svg>
    ),
    href: "/portal/user/verification-page",
  },
  {
    label: "Recipients",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
      </svg>
    ),
    href: "/portal/user/recipients",
  },
  {
    label: "Analytics",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="12" width="4" height="8" />
        <rect x="9" y="8" width="4" height="12" />
        <rect x="15" y="4" width="4" height="16" />
      </svg>
    ),
    href: "/portal/user/analytics",
  },
];

const dropdownItems = [
  {
    label: "Components",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),

    children: [
      {
        label: "Credential Designs",
        href: "/portal/user/credential-designs",
        icon: <Palette className="w-5 h-5" />,
      },
      {
        label: " Credential Details",
        href: "/portal/user/credential-details",
        icon: <BookOpen className="w-5 h-5" />,
      },
      {
        label: " Email Templates",
        href: "/portal/user/email-templates",
        icon: <Mail className="w-5 h-5" />,
      },
    ],
  },
  {
    label: "Advanced",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <polygon points="12 2 15 8 22 9 17 14 18 21 12 18 6 21 7 14 2 9 9 8 12 2" />
      </svg>
    ),
    children: [
      {
        label: "Collections",
        href: "/portal/user/collections",
        icon: <ScanQrCode className="w-5 h-5" />,
      },
      {
        label: "Integrations",
        href: "/portal/user/integrations",
        icon: <Network className="w-5 h-5" />,
      },
      {
        label: "Ads",
        href: "/portal/user/ads",
        icon: <Megaphone className="w-5 h-5" />,
      },
      {
        label: "Customer Portal",
        href: "/portal/user/customer-portal",
        icon: <LayoutPanelTop className="w-5 h-5" />,
      },
    ],
  },
];

const settingsItem = {
  label: "Settings",
  icon: (
    <svg
      className="w-7 h-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  href: "/settings",
};

type SideBarProps = {
  onHoverChange?: (expanded: boolean) => void;
};

export default function SideBar({ onHoverChange }: SideBarProps) {
  const [openCollapsible, setOpenCollapsible] = React.useState<string | null>(
    null
  );
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
    <aside
      ref={sidebarRef}
      className="h-screen group fixed px-2 left-0 top-0 z-40 flex flex-col justify-between transition-all duration-300 w-16 hover:w-72"
    >
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <nav className="py-6 flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`group/link flex items-center gap-4 px-4 py-3 rounded-lg duration-700 text-gray-700 hover:bg-green-50 group-hover:w-64 transition-all ${
                pathname === item.href ? "bg-green-50" : ""
              }`}
            >
              <span className="group-hover/link:translate-x-2 transition-all">
                {item.icon}
              </span>
              <span className="text-base font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          ))}
          {dropdownItems.map((dropdown) => (
            <Collapsible
              key={dropdown.label}
              open={openCollapsible === dropdown.label}
              onOpenChange={(open: boolean) =>
                setOpenCollapsible(open ? dropdown.label : null)
              }
              className="w-full"
            >
              <CollapsibleTrigger asChild>
                <button className="flex items-center gap-4 px-4 py-3 w-full rounded-lg transition-colors duration-700 text-gray-700 hover:bg-green-50 focus:outline-none">
                  <span className="group-hover/link:translate-x-2 transition-all">
                    {dropdown.icon}
                  </span>
                  <span className="ml-2 text-base font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {dropdown.label}
                  </span>
                  <svg
                    className={`w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform ${
                      openCollapsible === dropdown.label
                        ? "rotate-180"
                        : "rotate-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="pl-12 py-1">
                  {dropdown.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className={`group/link flex items-center gap-4 px-2 py-2 text-gray-700 hover:bg-green-50 rounded-lg text-sm ${
                        pathname === child.href
                          ? "bg-green-50 text-gray-700 hover:bg-green-50"
                          : ""
                      }`}
                    >
                      <span className="group-hover/link:translate-x-2 transition-all">
                        {child.icon}
                      </span>
                      <span>{child.label}</span>
                    </Link>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </nav>
      </div>
      <div className="mb-6 flex-shrink-0">
        <Link
          href={settingsItem.href}
          className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-700 text-gray-700 hover:bg-green-50 group-hover:w-64 ${
            pathname === settingsItem.href
              ? "bg-green-500 text-white hover:bg-green-600"
              : ""
          }`}
        >
          <span>{settingsItem.icon}</span>
          <span className="ml-2 text-base font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            {settingsItem.label}
          </span>
        </Link>
      </div>
    </aside>
  );
}
