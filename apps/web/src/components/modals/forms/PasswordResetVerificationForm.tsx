"use client";

import Spinner from "@/components/loaders/Spinner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import axiosClient from "@/config/axios.config";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PasswordResetVerificationProps {
  setMode: (mode: "password_reset") => void;
  email: string;
}

export default function PasswordResetVerification({ setMode, email }: PasswordResetVerificationProps) {
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [otp, setOtp] = useState<string>("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string>("");
  const [isNewOtpRequestPending, setIsNewRequestPending] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleResend = async () => {
    if (!canResend) return;
    setIsNewRequestPending(true);
    setCanResend(false);
    try {
      const response = await axiosClient.post("/auth/resend-otp", { email, purpose: "password_reset" });
      setTimer(30);
      toast.success(response.data.message);
    } catch (error: any) {
      console.error("Error resending OTP", error);
      toast.error(error.response.data.message || error.message || "Error resending OTP");
    } finally {
      setIsNewRequestPending(false);
    }
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (otp.length === 5) {
        handleVerifyOtp();
      }
    }, 100); // Debounce for 250ms
    return () => clearTimeout(timerId);
  }, [otp]);

  const handleVerifyOtp = async () => {
    if (!/^\d{5}$/.test(otp)) {
      setError("Please enter a valid 5-digit code.");
      return;
    }

    setIsPending(true);
    setError("");

    try {
      const response = await axiosClient.post("/auth/verify-otp", { email, code: otp, purpose: "password_reset" });
      toast.success(response.data.message);
      setMode("password_reset");
    } catch (error: any) {
      toast.error(error.response.data.message || "Error verifying OTP");
      console.error("Error verifying OTP", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full space-y-5 py-10">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-center">Verify your email</h1>
        <p className="text-[#454C52] text-center text-[16px]">
          To complete the password reset process, enter the 5-digit code to your email to complete verification.
        </p>
      </div>

      <div className="space-y-2 flex justify-center">
        <InputOTP maxLength={5} onChange={(value) => setOtp(value)}>
          <InputOTPGroup>
            <InputOTPSlot index={0} className="h-[70px] w-[75px]" />
            <InputOTPSlot index={1} className="h-[70px] w-[75px]" />
            <InputOTPSlot index={2} className="h-[70px] w-[75px]" />
            <InputOTPSlot index={3} className="h-[70px] w-[75px]" />
            <InputOTPSlot index={4} className="h-[70px] w-[75px]" />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <button
        onClick={handleVerifyOtp}
        className={`!mt-8 bg-primary h-16 rounded-full text-[16px] uppercase w-full text-white data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed flex items-center justify-center`}
        disabled={isPending || isNewOtpRequestPending}>
        {isPending ? <Spinner /> : "Continue"}
      </button>

      <p className="text-primary text-center">{`00:${timer.toString().padStart(2, "0")}`}</p>

      <p className="text-center text-[#808080] !mt-2">
        If you didn’t receive a code!{" "}
        <button
          disabled={isPending || isNewOtpRequestPending}
          onClick={handleResend}
          className={`underline ${canResend ? "text-primary cursor-pointer font-semibold" : "cursor-not-allowed"}`}>
          <span className="flex items-center gap-2">
            Resend{isNewOtpRequestPending && "ing"} {isNewOtpRequestPending && <Spinner size={12} color="#000" />}
          </span>
        </button>
      </p>
    </div>
  );
}
