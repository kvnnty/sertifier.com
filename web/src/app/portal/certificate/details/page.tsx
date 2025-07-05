import CertificateDetailsClient from "@/components/custom/portal/certificate/details/CertificateDetailsPageClient";
import { Suspense } from "react";

export default function CertificateDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CertificateDetailsClient />
    </Suspense>
  );
}