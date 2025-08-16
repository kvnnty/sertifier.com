"use client";

import dynamic from "next/dynamic";
import { Fragment } from "react";
import ReduxProvider from "./ReduxProvider";
import { Toaster } from "sonner";
import { AuthModalProvider } from "@/context/AuthModalContext";
import PageTransition from "./PageTransitionProvider";

const Next13ProgressBar = dynamic(() => import("next13-progressbar").then((mod) => mod.Next13ProgressBar), { ssr: false });

const GlobalApplicationProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Fragment>
      <PageTransition>
        <ReduxProvider>
          <AuthModalProvider>{children}</AuthModalProvider>
        </ReduxProvider>
      </PageTransition>
      <Next13ProgressBar height="4px" color="#43A047" options={{ showSpinner: true }} showOnShallow />
      <Toaster position="top-center" />
    </Fragment>
  );
};

export default GlobalApplicationProvider;
