"use client";

import { AuthModal } from "@/components/modals/AuthModal";
import { useAuth } from "@/lib/store/features/auth/auth.selector";
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type Mode = "forgot_password" | "password_reset_verification" | "password_reset" | "email_verification" | "login_verification";

interface OpenAuthModalOptions {
  email?: string;
  preventClose?: boolean;
}

interface AuthModalContextType {
  openAuthModal: (mode?: Mode, options?: OpenAuthModalOptions) => void;
  closeAuthModal: () => void;
  setEmail: (value: string) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<Mode | undefined>();
  const [canClose, setCanClose] = useState(true);
  const { currentUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const modalFromQuery = searchParams.get("auth-mode");
    if (modalFromQuery && ["forgot_password", "password_reset_verification", "password_reset", "email_verification", "login_verification"]) {
      setAuthModalMode(modalFromQuery as Mode);
      setIsAuthModalOpen(true);
    } else {
      setIsAuthModalOpen(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (currentUser?.isVerified) {
      setCanClose(true);
      setIsAuthModalOpen(false);
    }
  }, [currentUser?.isVerified]);

  const openAuthModal = (mode?: Mode, options: OpenAuthModalOptions = {}) => {
    if (!mode) return;

    const { email, preventClose } = options;

    setAuthModalMode(mode);
    setCanClose(!preventClose);
    setIsAuthModalOpen(true);

    if (email) {
      setEmail(email);
    }

    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("auth-mode", mode);
    router.push(newUrl.toString());
  };

  const closeAuthModal = () => {
    if (canClose) {
      setIsAuthModalOpen(false);
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("auth-mode");
      router.push(newUrl.toString());
    }
  };

  const handleModeChange = (newMode: Mode) => {
    setAuthModalMode(newMode);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("auth-mode", newMode);
    router.push(newUrl.toString());
  };

  return (
    <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal, setEmail }}>
      {children}
      <AuthModal
        onClose={closeAuthModal}
        isOpen={isAuthModalOpen}
        setIsOpen={setIsAuthModalOpen}
        mode={authModalMode}
        setMode={handleModeChange}
        canClose={canClose}
        email={email}
        setEmail={setEmail}
      />
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
};
