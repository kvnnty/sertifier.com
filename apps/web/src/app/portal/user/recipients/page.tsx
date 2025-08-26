import RecipientsClient from "@/components/custom/portal/user/RecipientsClient";
import { Suspense } from "react";

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div>Loading analytics...</div>}>
      <RecipientsClient />
    </Suspense>
  );
}