"use client";
import React, { useState } from "react";
import SideBar from "@/components/custom/SideBar";
import TopBar from "@/components/custom/TopBar";

export default function UserPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="flex min-h-screen">
      <SideBar onHoverChange={setSidebarExpanded} />
      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ marginLeft: sidebarExpanded ? 280 : 70 }} // 256px = 16rem, 64px = 4rem
      >
        <TopBar />
        <main className="flex-1 p-6 bg-gray-50 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
