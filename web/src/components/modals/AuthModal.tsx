"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AnimatePresence, motion } from "framer-motion";
import EmailVerificationForm from "./forms/EmailVerificationForm";
import ForgotPasswordForm from "./forms/ForgotPasswordForm";
import LoginVerificationForm from "./forms/LoginVerificationForm";
import ResetPasswordForm from "./forms/PasswordResetForm";
import VerifyPasswordResetOtpForm from "./forms/PasswordResetVerificationForm";

type Mode = "forgot_password" | "password_reset_verification" | "password_reset" | "email_verification" | "login_verification";
interface AuthModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  mode?: Mode | null;
  setMode: (mode: Mode) => void;
  canClose: boolean;
  onClose?: () => void;
  email: string;
  setEmail: (value: string) => void;
}

export function AuthModal({ isOpen, setIsOpen, mode, setMode, canClose, onClose, email, setEmail }: AuthModalProps) {
  const handleOpenChange = (isOpen: boolean) => {
    if (canClose) {
      if (!isOpen && onClose) {
        onClose();
      } else {
        setIsOpen(isOpen);
      }
    }
  };

  const renderForm = () => {
    switch (mode) {
      case "forgot_password":
        return <ForgotPasswordForm setMode={setMode} setEmail={setEmail} />;
      case "password_reset_verification":
        return <VerifyPasswordResetOtpForm setMode={setMode} email={email} />;
      case "password_reset":
        return <ResetPasswordForm email={email} />;
      case "email_verification":
        return <EmailVerificationForm email={email} />;
      case "login_verification":
        return <LoginVerificationForm email={email} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTitle className="hidden">Auth Modal</DialogTitle>
      <DialogContent className="p-0 px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full">
            {renderForm()}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
