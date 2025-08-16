"use client";

import Spinner from "@/components/loaders/Spinner";
import axiosClient from "@/config/axios.config";
import { useAuthModal } from "@/context/AuthModalContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function PasswordResetForm({ email }: { email: string }) {
  const [isPending, setIsPending] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const { closeAuthModal } = useAuthModal();

  const passwordResetSchema = z
    .object({
      newPassword: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords must match",
    });

  type passwordResetFormInputs = z.infer<typeof passwordResetSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<passwordResetFormInputs>({
    resolver: zodResolver(passwordResetSchema),
  });

  const toggleVisibility = (field: "newPassword" | "confirmPassword") => {
    setPasswordVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordReset: SubmitHandler<passwordResetFormInputs> = async (data) => {
    setIsPending(true);
    try {
      const response = await axiosClient.put("/auth/reset-password", {
        email,
        newPassword: data.newPassword,
      });

      toast.success(response.data.message);
      closeAuthModal();
    } catch (error: any) {
      const message = error.response?.data.message || error.message || "Failed to reset password";
      toast.error(message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handlePasswordReset)} className="w-full space-y-5 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-center">New Password</h1>
        <p className="text-primary-paragraph text-center text-[16px]">Set the new password for your account so you can log in and access all features.</p>
      </div>

      <div className="space-y-2">
        <label className="font-semibold">New Password</label>
        <div className="bg-[#F4F7FC] border-2 border-[#E7E7E7] w-full rounded-xl flex items-center pr-3">
          <input
            type={passwordVisibility.newPassword ? "text" : "password"}
            {...register("newPassword")}
            className="bg-transparent p-4 h-16 w-full outline-none"
            placeholder="Enter your password"
          />
          <button type="button" onClick={() => toggleVisibility("newPassword")} className="text-[#808080]">
            {passwordVisibility.newPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="font-semibold">Confirm Password</label>
        <div className="bg-[#F4F7FC] border-2 border-[#E7E7E7] w-full rounded-xl flex items-center pr-3">
          <input
            type={passwordVisibility.confirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            className="bg-transparent p-4 h-16 w-full outline-none"
            placeholder="Confirm your password"
          />
          <button type="button" onClick={() => toggleVisibility("confirmPassword")} className="text-[#808080]">
            {passwordVisibility.confirmPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
      </div>

      <button
        disabled={isPending}
        type="submit"
        className="!mt-8 bg-primary h-16 rounded-full text-[16px] uppercase w-full text-white flex justify-center items-center data-[disabled]:opacity-80 data-[disabled]:cursor-default">
        {isPending ? <Spinner /> : "Reset Password"}
      </button>
    </form>
  );
}
