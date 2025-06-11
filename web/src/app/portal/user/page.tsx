"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

const suggestions = [
  {
    description:
      "A completion certificate for participants who have successfully finished our 'Advanced Digital Marketing' online course.",
    button: "Try This",
    type: "red",
  },
  {
    description:
      "A participation certificate for attendees of our Annual AI & Machine Learning Summit, which brought together industry experts, ...",
    button: "Try This",
    type: "green",
  },
  {
    description:
      "A recognition certificate for employees who have completed our six-month internal Leadership Development Program. This...",
    button: "Try This",
    type: "blue",
  },
  {
    description:
      "An achievement certificate for students who successfully developed and launched a fully functional mobile application as part of our...",
    button: "Try This",
    type: "green",
  },
];

export default function UserDashboard() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hasOverflow, setHasOverflow] = useState<boolean[]>([]);
  const [textareaValue, setTextareaValue] = useState("");
  const descriptionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const checkOverflow = () => {
      const newHasOverflow = descriptionRefs.current.map((ref) => {
        if (!ref) return false;
        return ref.scrollHeight > ref.clientHeight;
      });
      setHasOverflow(newHasOverflow);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  const handleTryThis = (description: string) => {
    setTextareaValue(description);
    // Scroll to textarea
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.scrollIntoView({ behavior: "smooth", block: "center" });
      textarea.focus();
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 space-y-12">
      <h1 className="text-4xl font-bold text-center">
        <span className="bg-gradient-to-r from-red-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
          What are we creating a certificate for today?
        </span>
      </h1>

      <Textarea
        value={textareaValue}
        onChange={(e) => setTextareaValue(e.target.value)}
        className="w-full text-lg p-4 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[150px] text-gray-700"
        placeholder="Provide a detailed description of the certificate. Include the purpose of the certificate, the audience it is intended for, and the specific achievement or event being recognized. The more you share, the better we can craft it!"
      />

      <div className="flex justify-between items-center">
        <Link
          href="/create-manually"
          className="font-semibold text-gray-700 hover:underline underline-offset-3 duration-300"
        >
          Skip and create manually
        </Link>
        <Button className="bg-gradient-to-r from-pink-400 via-purple-400 to-green-400 text-white font-semibold px-8 py-6 rounded-md text-lg shadow-md hover:opacity-90 transition">
          Send Certificates
        </Button>
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suggestions.map((suggestion, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-6 flex flex-col justify-between min-h-[200px]"
          >
            <div
              ref={(el) => {
                descriptionRefs.current[i] = el;
              }}
              className={`text-base font-medium text-gray-800 mb-4 transition-all duration-300 ease-in-out ${
                openIndex === i ? "line-clamp-none" : "line-clamp-3"
              }`}
            >
              {suggestion.description}
            </div>
            <div className="flex items-center justify-between">
              {hasOverflow[i] && (
                <Collapsible
                  open={openIndex === i}
                  onOpenChange={(open) => setOpenIndex(open ? i : null)}
                >
                  <CollapsibleTrigger asChild>
                    <button className="text-sm font-semibold text-gray-600 flex items-center gap-1 hover:underline transition-all duration-300">
                      <span className="transition-opacity duration-300">
                        {openIndex === i ? "Show Less" : "Show More"}
                      </span>
                      <span className="transition-transform duration-300">
                        {openIndex === i ? (
                          <ChevronUpIcon size={20} />
                        ) : (
                          <ChevronDownIcon size={20} />
                        )}
                      </span>
                    </button>
                  </CollapsibleTrigger>
                </Collapsible>
              )}
              <Button
                variant="ghost"
                onClick={() => handleTryThis(suggestion.description)}
                className={
                  suggestion.type === "red"
                    ? "text-red-500 border border-red-200 bg-red-50 hover:bg-red-100"
                    : suggestion.type === "green"
                    ? "text-green-600 border border-green-200 bg-green-50 hover:bg-green-100"
                    : "text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100"
                }
              >
                {suggestion.button}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
