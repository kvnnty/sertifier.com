"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileBadge, Tag, ImageIcon, Layers, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

interface SideBarProps {
  onFeatureChange?: (feature: string) => void;
  activeFeature?: string;
}

const menuItems = [
  {
    label: "Templates",
    icon: <FileBadge className="h-6 w-6" />,
    value: "templates",
  },
  {
    label: "Attributes",
    icon: <Tag className="h-6 w-6" />,
    value: "attributes",
  },
  {
    label: "Images",
    icon: <ImageIcon className="h-6 w-6" />,
    value: "elements",
  },
  {
    label: "Layers",
    icon: <Layers className="h-6 w-6" />,
    value: "layers",
  },
  {
    label: "QR Code",
    icon: <QrCode className="h-6 w-6" />,
    value: "qrcode",
  },
];

export default function CertificateSideBar({
  onFeatureChange,
  activeFeature = "templates",
}: SideBarProps) {
  const pathname = usePathname();

  const handleItemClick = (value: string) => {
    if (onFeatureChange) {
      onFeatureChange(value);
    }
  };

  return (
    <aside className="fixed left-0 top-20 z-30 w-20 h-[calc(100vh-5rem)] group hover:w-64 transition-all duration-300">
      <div className="absolute inset-0 bg-white border-r transition-all duration-300 hover:shadow-lg"></div>
      <nav className="flex flex-col gap-4 py-6 relative z-20 h-full">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleItemClick(item.value)}
            className={cn(
              "mx-4 flex items-center gap-4 rounded-lg px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-green-50 hover:text-green-700",
              activeFeature === item.value ? "bg-green-100 text-green-700" : ""
            )}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="whitespace-nowrap text-base font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100 overflow-hidden">
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
