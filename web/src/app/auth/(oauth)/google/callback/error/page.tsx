"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "sonner";

export default function OauthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("message");
  const router = useRouter();

  useEffect(() => {
    if (error) toast.error(error || "An error occurred while loggin you with google. Please try again.");
  }, []);

  return router.replace("/auth/login");
}
