"use client";
import TopBar from "@/components/custom/portal/certificate/TopBar";
import React, { useState } from "react";

export default function UserPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <TopBar />
      <main className="flex-1 min-h-screen">{children}</main>
    </div>
  );
}
