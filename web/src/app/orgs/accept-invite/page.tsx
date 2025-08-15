"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosClient from "@/config/axios.config";

// React Hook Form + Zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// ShadCN components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import Image from "next/image";
import Spinner from "@/components/loaders/Spinner";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type UserProfileForm = z.infer<typeof profileSchema>;

export default function AcceptInvitation() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const isNewUser = searchParams.get("new-user") === "true";

  const [status, setStatus] = useState<"idle" | "loading" | "needsProfile" | "success" | "error">("idle");
  const [userId, setUserId] = useState<string | null>(null);

  const form = useForm<UserProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: "", lastName: "", password: "" },
  });

  useEffect(() => {
    if (!token) {
      toast.error("Invite token is missing");
      setStatus("error");
      return;
    }

    const acceptInvite = async () => {
      setStatus("loading");
      try {
        const res = await axiosClient.post("/organizations/accept-invite", { token });

        if (isNewUser) {
          setStatus("needsProfile");
          setUserId(res.data.userId); // backend should return userId for new users
        } else {
          toast.success("Invitation accepted! Login to continue");
          router.push("/auth/login");
        }
      } catch (err: any) {
        setStatus("error");
        toast.error(err.response?.data?.message || err.message || "Something went wrong");
      }
    };

    acceptInvite();
  }, [token]);

  const onSubmit = async (data: UserProfileForm) => {
    if (!userId) return;

    try {
      await axiosClient.post("/users/complete-profile", { userId, ...data });
      setStatus("success");
      toast.success("Profile completed successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to complete profile");
    }
  };

  if (status === "loading")
    return (
      <div className="grid place-content-center h-screen">
        <div className="flex flex-col gap-3 justify-center items-center">
          <Spinner color="#000" size={40} />
          Processing invitation...
        </div>
      </div>
    );
  if (status === "error") return <div className="grid place-content-center h-screen">We are unable to process this invitation.</div>;
  if (status === "success") return <div className="grid place-content-center h-screen">Invitation accepted! You can now access the organization.</div>;

  if (status === "needsProfile") {
    return (
      <div className="min-h-screen grid place-content-center">
        <div className="px-8 max-w-lg">
          <h1 className="text-3xl mb-8 text-gray-900 text-center font-bold leading-normal">Complete your account to continue</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <Label>First Name</Label>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <Label>Last Name</Label>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label>Set your Password</Label>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary">
                Complete Profile
              </Button>
            </form>
          </Form>
        </div>
      </div>
    );
  }

  return null;
}
