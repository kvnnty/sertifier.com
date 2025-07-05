import AnalyticsClient from "@/components/custom/portal/user/analytics/AnalyticsClient";
import { Suspense } from "react";

const analyticsData = {
  totalRecipients: 0,
  totalCredentials: 0,
  successfulDeliveries: 0,
  openedEmails: 0,
  credentialViews: 0,
  addedToLinkedIn: 0,
  shared: 10,
  downloaded: 10,
};

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div>Loading analytics...</div>}>
      <AnalyticsClient analyticsData={analyticsData} />
    </Suspense>
  );
}
