"use client";

import axiosClient from "@/config/axios.config";
import { toast } from "sonner";
import { login, updateAccessToken } from "@/lib/store/features/auth/auth.slice";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Spinner from "@/components/loaders/Spinner";

const GoogleSuccessOauthCallback = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("access_token");

  useEffect(() => {
    if (!accessToken) {
      toast.error("Missing access token. Try Logging in again or contact us for support.");
      router.push("/");
      return;
    }

    dispatch(updateAccessToken(accessToken));
    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    fetchProfile();
  }, [dispatch]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/users/me");
      dispatch(login({ user: response.data, accessToken: accessToken }));
      router.replace("/portal/user");
    } catch (error: any) {
      toast.error(error.response?.data.message || error.message || "Something went wrong processing your request");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [dispatch]);

  if (loading)
    return (
      <div className="h-[80vh] w-full flex flex-col gap-4 justify-center items-center">
        <Spinner size={40} color="#000" />
        Authenticating...
      </div>
    );
};

export default GoogleSuccessOauthCallback;
