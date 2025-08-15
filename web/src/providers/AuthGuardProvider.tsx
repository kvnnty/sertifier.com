"use client";

import { useAuthModal } from "@/context/AuthModalContext";
import { AppDispatch } from "@/lib/store";
import { useAuth } from "@/lib/store/features/auth/auth.selector";
import { fetchCurrentUser } from "@/lib/store/features/auth/auth.thunks";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthGuardProvider({ children }: AuthProviderProps) {
  const { isLoggedIn, currentUser } = useAuth();
  const { openAuthModal } = useAuthModal();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        if (isLoggedIn) {
          dispatch(fetchCurrentUser()).unwrap();
        }
      } catch (error: any) {
        toast.error(error.response?.data.message || error.message || "Something went wrong processing your request");
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) fetchUserData();
    else setLoading(false);
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        toast.warning("Please login to access this resource");
        router.replace("/auth/login");
        return;
      }

      if (isLoggedIn && !currentUser?.isVerified) {
        openAuthModal("email_verification", { preventClose: true, email: currentUser?.email });
      }
    }
  }, [isLoggedIn, currentUser, router, loading]);

  if (loading) return null;
  if (!isLoggedIn) return null;

  return <>{children}</>;
}
