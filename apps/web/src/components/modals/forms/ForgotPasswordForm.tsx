"use client";

import Spinner from "@/components/loaders/Spinner";
import axiosClient from "@/config/axios.config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function ForgotPasswordForm({
  setMode,
  setEmail,
}: {
  setMode: (mode: "password_reset_verification") => void;
  setEmail: (value: string) => void;
}) {
  const [isPending, setIsPending] = useState(false);

  const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
  });

  type ForgotPasswordFormInputs = z.infer<typeof forgotPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const handleForgotPassword: SubmitHandler<ForgotPasswordFormInputs> = async (data) => {
    setIsPending(true);
    try {
      const response = await axiosClient.post("/auth/forgot-password", data);

      toast.success(response.data.message);
      setEmail(data.email);
      setMode("password_reset_verification");
    } catch (error: any) {
      const message = error.response?.data.message || error.message || "Failed to send verification code";
      toast.error(message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleForgotPassword)} className="w-full space-y-5 py-10">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-center">Forgot Your Password?</h1>
        <p className="text-[#454C52] text-center text-[16px]">Enter your email for the verification process. We will send a 5-digit code to your email.</p>
      </div>

      <div className="space-y-2">
        <label className="font-semibold">Email</label>
        <div className="bg-[#F4F7FC] border-2 border-[#E7E7E7] w-full rounded-xl">
          <input type="email" {...register("email")} className="bg-transparent p-4 h-16 w-full outline-none" placeholder="Enter your email" />
        </div>
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <button
        disabled={isPending}
        type="submit"
        className="!mt-8 bg-primary h-16 rounded-full text-[16px] uppercase w-full text-white flex justify-center items-center data-[disabled]:opacity-80 data-[disabled]:cursor-default">
        {isPending ? <Spinner /> : "Continue"}
      </button>
    </form>
  );
}
