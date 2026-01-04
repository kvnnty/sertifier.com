"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpIcon, ChevronDownIcon, ChevronUpIcon, Wand2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const suggestions = [
  {
    description:
      "A completion certificate for participants who have successfully finished our ‘Advanced Digital Marketing’ online course. This program is designed for marketing professionals looking to enhance their expertise in SEO, PPC, content marketing, and social media strategy. The certificate serves as a formal acknowledgment of their dedication, knowledge, and skill development, providing credibility in their professional journey.",
    button: "Try This",
    type: "red",
  },
  {
    description:
      "A participation certificate for attendees of our Annual AI & Machine Learning Summit, which brought together industry experts, researchers, and practitioners for an in-depth discussion on the latest trends and advancements in AI. This certificate acknowledges their engagement in expert-led workshops, keynote sessions, and networking opportunities, solidifying their role as thought leaders in the AI community.",
    button: "Try This",
    type: "green",
  },
  {
    description:
      "A recognition certificate for employees who have completed our six-month internal Leadership Development Program. This program equips emerging leaders with essential management skills, strategic decision-making abilities, and conflict-resolution techniques. The certificate acknowledges their commitment to professional growth and readiness to take on leadership roles within the organization.",
    button: "Try This",
    type: "blue",
  },
  {
    description:
      "An achievement certificate for students who successfully developed and launched a fully functional mobile application as part of our ‘Introduction to App Development’ bootcamp. This intensive hands-on program teaches students how to design, develop, and deploy mobile applications from scratch, culminating in a final project where they present and launch their own app. The certificate recognizes their technical proficiency, creativity, and ability to bring ideas to life.",
    button: "Try This",
    type: "green",
  },
];

export default function UserDashboard() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [textareaValue, setTextareaValue] = useState("");

  const handleTryThis = (description: string) => {
    setTextareaValue(description);
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.scrollIntoView({ behavior: "smooth", block: "center" });
      textarea.focus();
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-8 space-y-5">
      <h1 className="text-2xl font-bold text-center">
        What are we creating a certificate for today?
      </h1>

      <Textarea
        value={textareaValue}
        onChange={(e) => setTextareaValue(e.target.value)}
        className="w-full text-lg p-4 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[150px] text-gray-700"
        placeholder="Provide a detailed description of the certificate. Include the purpose of the certificate, the audience it is intended for, and the specific achievement or event being recognized. The more you share, the better we can craft it!"
      />

      <div className="flex justify-between items-center">
        <Link
          href="/design/certificate"
          className="font-semibold text-gray-700 hover:underline underline-offset-3 duration-300"
        >
          Skip and create manually
        </Link>
        <Button className="cursor-pointer bg-primary text-white px-10 py-5 rounded-md shadow-md transition-all">
          Build Certificate
          <Wand2/>
        </Button>
      </div>

      <div className="columns-2 space-x-3 space-y-3">
        {suggestions.map((suggestion, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="w-full break-inside-avoid bg-white rounded-lg shadow p-6 flex flex-col justify-between"
            >
              <div
                className={`text-base font-medium text-gray-800 mb-4 transition-all duration-300 ease-in-out ${
                  isOpen ? "" : "line-clamp-3"
                }`}
              >
                {suggestion.description}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="text-sm font-semibold text-gray-600 flex items-center gap-1 hover:underline transition-all duration-300"
                >
                  <span>{isOpen ? "Show Less" : "Show More"}</span>
                  {isOpen ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
                </button>

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
                  <ArrowUpIcon/>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
