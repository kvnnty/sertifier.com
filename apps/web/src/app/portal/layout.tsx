import AuthGuardProvider from "@/providers/AuthGuardProvider";
import OrgProvider from "@/providers/OrgProvider";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "App | Sertifier",
  description: "Digital credentialing platform issuing verified certificates and badges for organizations.",
};

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <AuthGuardProvider>
        <OrgProvider>
          {children}
        </OrgProvider>
      </AuthGuardProvider>
    </main>
  );
}
