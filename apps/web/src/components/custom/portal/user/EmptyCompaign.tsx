"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";

interface EmptyCompaignProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const EmptyCompaign = ({
  title = "Let's Create a Campaign!",
  description = "Campaigns are the primary way to issue credentials. They contain the design, details, and email template used to issue credentials to your recipients.",
  buttonText = "Create a Campaign",
  onButtonClick,
}: EmptyCompaignProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 max-h-screen overflow-hidden">
      {/* Illustration */}
      <Image
        src="/images/empty-state.png"
        alt="Empty state"
        width={400}
        height={400}
      />
      {/* Content */}
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">{description}</p>

        <Button
          onClick={onButtonClick}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {buttonText}
        </Button>

        <div className="mt-4">
          <button className="text-gray-500 hover:text-gray-700 underline text-sm">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmptyCompaign;
