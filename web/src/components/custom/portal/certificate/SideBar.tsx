"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileBadge, Tag, ImageIcon, Layers, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    label: "Templates",
    icon: <FileBadge className="h-6 w-6" />,
    href: "/portal/certificate/credential-designs",
  },
  {
    label: "Attributes",
    icon: <Tag className="h-6 w-6" />,
    href: "#",
  },
  {
    label: "Images",
    icon: <ImageIcon className="h-6 w-6" />,
    href: "#",
  },
  {
    label: "Layers",
    icon: <Layers className="h-6 w-6" />,
    href: "#",
  },
  {
    label: "QR Code",
    icon: <QrCode className="h-6 w-6" />,
    href: "#",
  },
];

export default function CertificateSideBar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-20 z-30 flex h-screen w-20 flex-col border-r bg-white transition-all duration-300 group hover:w-64">
      <nav className="flex flex-col gap-4 py-6">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "mx-4 flex items-center gap-4 rounded-lg px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-green-50 hover:text-green-700",
              pathname === item.href ? "bg-green-100 text-green-700" : ""
            )}
          >
            <span>{item.icon}</span>
            <span className="whitespace-nowrap text-base font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
